import { emitNewChatToParticpants } from "../lib/socket";
import ChatModel from "../models/chat.model";
import MessageModel from "../models/message.model";
import UserModel from "../models/user.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";

export const createChatService = async ( // parametre vient de  du frontend
  userId: string,
  body: {
    participantId?: string;
    isGroup?: boolean;
    participants?: string[];
    groupName?: string;
  }
) => {
  const { participantId, isGroup, participants, groupName } = body;

  let chat;
  let allParticipantIds: string[] = [];

  if (isGroup && participants?.length && groupName) {
    allParticipantIds = [userId, ...participants];
    chat = await ChatModel.create({
      participants: allParticipantIds,
      isGroup: true,
      groupName,
      createdBy: userId,
    });
  } else if (participantId) {
    const otherUser = await UserModel.findById(participantId);
    if (!otherUser) throw new NotFoundException("User not found");

    allParticipantIds = [userId, participantId];
    const existingChat = await ChatModel.findOne({
      participants: {
        $all: allParticipantIds,
        $size: 2,
      },
    }).populate("participants", "name avatar isAI");

    if (existingChat) return existingChat;

    chat = await ChatModel.create({
      participants: allParticipantIds,
      isGroup: false,
      createdBy: userId,
    });
  }

  // -------------------------------------------------------------
  // Implement websocket

 const populatedChat = await chat?.populate(
    "participants",
    "name avatar isAI"
  );

  const particpantIdStrings = populatedChat?.participants?.map((p) => {
    return p._id?.toString();
  });

  emitNewChatToParticpants(particpantIdStrings, populatedChat);

  return chat;
};

export const getUserChatsService = async (userId: string) => {
  const chats = await ChatModel.find({
    participants: {
      $in: [userId],
    },
  })
    .populate("participants", "name avatar isAI")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "name avatar",
      },
    })
    .sort({ updatedAt: -1 }); // chat le plus recent en haut
  return chats;
};

/**
 * 
 *{
  "_id": "65f1001",
  "participants": [
    {
      "_id": "u1",
      "name": "Alice",
      "avatar": "/avatars/alice.png"
    },
    {
      "_id": "u2",
      "name": "Bob",
      "avatar": "/avatars/bob.png"
    }
  ],
  "lastMessage": {
    "_id": "m55",
    "content": "Salut, ça va ?",
    "sender": {
      "_id": "u2",
      "name": "Bob",
      "avatar": "/avatars/bob.png"
    },
    "createdAt": "2026-01-10T10:29:00Z"
  },
  "isGroup": false,
  "createdBy": "u1",
  "createdAt": "2026-01-10T10:00:00Z",
  "updatedAt": "2026-01-10T10:30:00Z"
}

 */

export const getSingleChatService = async (chatId: string, userId: string) => {
  const chat = await ChatModel.findOne({
    _id: chatId,
    participants: {
      $in: [userId],
    },
  }).populate("participants", "name avatar isAI");

  if (!chat)
    throw new BadRequestException(
      "Chat not found or you are not authorized to view this chat"
    );

  const messages = await MessageModel.find({ chatId })
    .populate("sender", "name avatar isAI")
    .populate({
      path: "replyTo",
      select: "content image sender",
      populate: {
        path: "sender",
        select: "name avatar isAI",
      },
    })
    .sort({ createdAt: 1 }); // messages du plus ancien au plus récent

  return {
    chat,
    messages,
  };
};

/**{
  "_id": "m2",
  "chatId": "65f1001",
  "content": "Ça va et toi ?",
  "image": null,
  "sender": {
    "_id": "u2",
    "name": "Bob",
    "avatar": "/avatars/bob.png"
  },
  "replyTo": {
    "_id": "m1",
    "content": "Salut Bob",
    "image": null,
    "sender": {
      "_id": "u1",
      "name": "Alice",
      "avatar": "/avatars/alice.png"
    }
  },
  "createdAt": "2026-01-10T10:06:00Z",
  "updatedAt": "2026-01-10T10:06:00Z"
}
 */


export const validateChatParticipant = async (
  chatId: string,
  userId: string
) => {
  const chat = await ChatModel.findOne({
    _id: chatId,
    participants: {
      $in: [userId],
    },
  });
  if (!chat) throw new BadRequestException("User not a participant in chat");
  return chat;
};