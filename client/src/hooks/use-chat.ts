/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { UserType } from "@/types/auth.type";
import type {
  ChatType,
  CreateChatType,
  CreateMessageType,
  MessageType,
} from "@/types/chat.type";
import { API } from "@/lib/axios-client";
import { toast } from "sonner";
import { useAuth } from "./use-auth";
import { generateUUID } from "@/lib/helper";

interface ChatState {
  chats: ChatType[]; // List of all chats for the authenticated user
  users: UserType[]; // List of all users
  singleChat: {
    chat: ChatType;
    messages: MessageType[];
  } | null;

  currentAIStreamId: string | null;

  isChatsLoading: boolean;
  isUsersLoading: boolean;
  isCreatingChat: boolean;
  isSingleChatLoading: boolean;
  isSendingMsg: boolean;

  fetchAllUsers: () => void;
  fetchChats: () => void;
  createChat: (payload: CreateChatType) => Promise<ChatType | null>;
  fetchSingleChat: (chatId: string) => void;
  sendMessage: (payload: CreateMessageType, isAiChat?: boolean) => void;

  addNewChat: (newChat: ChatType) => void;
  updateChatLastMessage: (chatId: string, lastMessage: MessageType) => void;
  addNewMessage: (chatId: string, message: MessageType) => void;

  addOrUpdateMessage: (chatId: string, message: MessageType, temptId?: string) => void;
}

export const useChat = create<ChatState>()((set, get) => ({
  chats: [],
  users: [],
  singleChat: null,

  isChatsLoading: false,
  isUsersLoading: false,
  isCreatingChat: false,
  isSingleChatLoading: false,
  isSendingMsg: false,

  currentAIStreamId: null,

  fetchAllUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await API.get("/user/all");
      set({ users: data.users }); 
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  fetchChats: async () => {
    set({ isChatsLoading: true });
    try {
      const { data } = await API.get("/chat/all");
      set({ chats: data.chats }); 
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch chats");
    } finally {
      set({ isChatsLoading: false });
    }
  },

  createChat: async (payload: CreateChatType) => {
    set({ isCreatingChat: true });
    try {
      const response = await API.post("/chat/create", {
        ...payload,
      });
      get().addNewChat(response.data.chat);
      toast.success("Chat created successfully");
      return response.data.chat;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch chats");
      return null;
    } finally {
      set({ isCreatingChat: false });
    }
  },

  fetchSingleChat: async (chatId: string) => {
    set({ isSingleChatLoading: true });
    try {
      const { data } = await API.get(`/chat/${chatId}`);
      set({ singleChat: data });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch chats");
    } finally {
      set({ isSingleChatLoading: false });
    }
  },

  sendMessage: async (payload: CreateMessageType, isAiChat?: boolean) => {
    set({ isSendingMsg: true });
    const { chatId, replyTo, content, image } = payload;
    const { user } = useAuth.getState();

    const chat = get().singleChat?.chat;
    const aiSender = chat?.participants.find((p) => p.isAI);
    
    console.log("📤 Sending message:", { isAiChat, hasAiSender: !!aiSender });

    if (!chatId || !user?._id) return;

    const tempUserId = generateUUID();
    const tempAIId = generateUUID();

    const tempMessage = {
      _id: tempUserId,
      chatId,
      content: content || "",
      image: image || null,
      sender: user,
      replyTo: replyTo || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: !isAiChat ? "sending..." : "",
    };
    get().addOrUpdateMessage(chatId, tempMessage, tempUserId);

    if(isAiChat && aiSender) {
      const tempAIMessage = {
        _id: tempAIId,
        chatId,
        content: "",
        image: null,
        sender: aiSender,
        replyTo: null,
        streaming: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      get().addOrUpdateMessage(chatId, tempAIMessage, tempAIId);
    
    }
    // if (isAI) {
    //  // AI Feature Source code link =>
    // }

   /**  set((state) => {
      if (state.singleChat?.chat?._id !== chatId) return state;
      return {
        singleChat: {
          ...state.singleChat,
          messages: [...state.singleChat.messages, tempMessage],
        },
      };
    }); */

    try {
      const { data } = await API.post("/chat/message/send", {
        chatId,
        content,
        image,
        replyToId: replyTo?._id,
      });
      const { userMessage, aiResponse } = data;

      get().addOrUpdateMessage(chatId, userMessage, tempUserId);
      
      if(isAiChat && aiResponse) {
        get().addOrUpdateMessage(chatId, aiResponse, tempAIId);
      }

      //replace the temp user message
      /**set((state) => {
        if (!state.singleChat) return state;
        return {
          singleChat: {
            ...state.singleChat,
            messages: state.singleChat.messages.map((msg) =>
              msg._id === tempUserId ? userMessage : msg
            ),
          },
        };*
      });*/

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      set({ isSendingMsg: false });
    }
  },

  addNewChat: (newChat: ChatType) => {
    set((state) => {
      const existingChatIndex = state.chats.findIndex(
        (c) => c._id === newChat._id
      );
      if (existingChatIndex !== -1) {
        //move the chat to the top
        return {
          chats: [newChat, ...state.chats.filter((c) => c._id !== newChat._id)],
        };
      } else {
        return {
          chats: [newChat, ...state.chats],
        };
      }
    });
  },

  updateChatLastMessage: (chatId, lastMessage) => {
    set((state) => {
      const chat = state.chats.find((c) => c._id === chatId);
      if (!chat) return state;
      return {
        chats: [
          { ...chat, lastMessage },
          ...state.chats.filter((c) => c._id !== chatId),
        ],
      };
    });
  },

  addNewMessage: (chatId, message) => {
    const chat = get().singleChat;
    if (chat?.chat._id === chatId) {
      set({
        singleChat: {
          chat: chat.chat,
          messages: [...chat.messages, message],
        },
      });
    }
  },

  addOrUpdateMessage: (chatId: string, msg: MessageType, tempId?: string) => {
  const singleChat = get().singleChat;
  if (!singleChat || singleChat.chat._id !== chatId) return;

  const messages = singleChat.messages;
  const msgIndex = tempId
    ? messages.findIndex((msg) => msg._id === tempId)
    : -1;

  let updatedMessages;
  if (msgIndex !== -1) {
    updatedMessages = messages.map((message, i) =>
      i === msgIndex ? { ...msg } : message
    );
  } else {
    updatedMessages = [...messages, msg]; // 'updatedMessages' is assigned a value but
  }

  set({
  singleChat: {
    ...singleChat,
    chat: singleChat.chat,
    messages: updatedMessages
  }
});


},

}));
