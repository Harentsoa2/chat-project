import { createGoogleGenerativeAI } from "@ai-sdk/google"
import {streamText, ModelMessage } from "ai";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config";
import ChatModel from "../models/chat.model";
import MessageModel from "../models/message.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { emitChatAI, emitLastMessageToParticipants, emitNewMessageToChatRoom } from "../lib/socket";
import UserModel from "../models/user.model";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

export const sendMessageService = async (
  userId: string, // userId du client
  body: {
    chatId: string; // venir du client
    content?: string;
    image?: string;
    replyToId?: string;
  }
) => {
  const { chatId, content, image, replyToId } = body;

  const chat = await ChatModel.findOne({
    _id: chatId,
    participants: {
      $in: [userId],
    }, // trouve le chat avec le is et le participant
  });
  if (!chat) throw new BadRequestException("Chat not found or unauthorized");

  if (replyToId) {
    const replyMessage = await MessageModel.findOne({
      _id: replyToId,
      chatId,
    }); // chercher le message dans le chat
    if (!replyMessage) throw new NotFoundException("Reply message not found");
  }

  let imageUrl;

  if (image) {
    //upload the image to cloudinary
    const uploadRes = await cloudinary.uploader.upload(image);
    imageUrl = uploadRes.secure_url; 
  }

  const newMessage = await MessageModel.create({
    chatId,
    sender: userId,
    content,
    image: imageUrl,
    replyTo: replyToId || null,
  }); // create the message ca marche aussi si newMessahe.save()

  await newMessage.populate([
    { path: "sender", select: "name avatar" },
    {
      path: "replyTo",
      select: "content image sender",
      populate: {
        path: "sender",
        select: "name avatar",
      },
    },
  ]);

  chat.lastMessage = newMessage._id as mongoose.Types.ObjectId; // expliquer poursoi on obtient lasr message ?
  await chat.save(); 

  //websocket emit the new Message to the chat room
  emitNewMessageToChatRoom(userId, chatId, newMessage);

  //websocket emit the lastmessage to members (personnal room user)
  const allParticipantIds = chat.participants.map((id) => id.toString());
   emitLastMessageToParticipants(allParticipantIds, chatId, newMessage);

   let aiResponse = null;

  if (chat.isAiChat) {
    aiResponse = await getAIResponse(chatId, userId);
    if(aiResponse && typeof aiResponse === 'object' && '_id' in aiResponse) {
    chat.lastMessage = aiResponse._id as mongoose.Types.ObjectId;
    await chat.save();
  }
}

  return {
    userMessage: newMessage,
    aiResponse, // 
    chat,
    isAiChat: chat.isAiChat,
  };
};

async function getChatHistory(chatId: string) { // a qoui ca sert ? pour le getAirespone
  const messages = await MessageModel.find({ chatId })
    .populate("sender", "isAI")
    .populate("replyTo", "content")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return messages.reverse();
}

const getAIResponse = async (chatId: string, userId: string) => { // expliquer en detail ?
  const whopAI = await UserModel.findOne({ isAI: true });
  if (!whopAI) return new NotFoundException("Whoop AI user not found");
  
  const chatHistory = await getChatHistory(chatId);
  const formattedMessages: ModelMessage[] = chatHistory.map((msg: any) => {
  const role = msg.sender.isAI ? "assistant" : "user";
  const parts: any[] = [];

  if (msg.image) {
    parts.push({
      type: "file",
      data: msg.image,
      mediaType: "image/png",
      filename: "image.png",
    });
  }

  if (msg.content) {
    parts.push({
      type: "text",
      text: msg.replyTo
        ? `Replying to: "${msg.replyTo.content}"\n\n${msg.content}`
        : msg.content,
    });
  }

  return { role, content: parts };
});

const result = await streamText({
  model: google("gemini-2.5-flash"),
  messages: formattedMessages,
  system:
    "You are Whoop AI, a helpful and friendly assistant. Respond only with text and attend to the last user message only.",
});

let fullResponse = "";
for await (const chunk of result.textStream) {
  emitChatAI({
    chatId,
    chunk,
    sender: whopAI,
    done: false,
    message: null,
  });
  fullResponse += chunk;
}

if (!fullResponse.trim()) return "";

const aiMessage = await MessageModel.create({
  chatId,
  sender: whopAI._id,
  content: fullResponse,
});

await aiMessage.populate("sender", "name avatar isAI");

// emit if fullresponse message
emitChatAI({
  chatId,
  chunk: null,
  sender: whopAI,
  done: true,
  message: aiMessage,
});

emitLastMessageToParticipants([userId], chatId, aiMessage);

return aiMessage;
}