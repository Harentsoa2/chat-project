import { useEffect, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { Spinner } from "../ui/spinner";
import ChatListItem from "./chat-list-item";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import ChatListHeader from "./chat-list-header";
import { useSocket } from "@/hooks/use-socket";
import type { ChatType } from "@/types/chat.type";
import type { MessageType } from "../../types/chat.type";

const ChatList = () => {
  const navigate = useNavigate(); // sert a naviquer , quand on l utilise ?
  const { socket } = useSocket(); // quadn on l utilise ?
  const {
    fetchChats,
    chats,
    isChatsLoading,
    addNewChat,
    updateChatLastMessage,
  } = useChat();
  const { user } = useAuth();
  const currentUserId = user?._id || null;

  const [searchQuery, setSearchQuery] = useState(""); // prouquoi on a besoin de ca ? la on fait react hook form ? mais input tout simplement ?

  const filteredChats =
    chats?.filter(
      (chat) =>
        chat.groupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.participants?.some(
          (p) =>
            p._id !== currentUserId &&
            p.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || []; // ca filtre quoi ? et pourquoi filtrer

  useEffect(() => {
    fetchChats();
  }, [fetchChats]); // expliquer ?

  useEffect(() => {
    if (!socket) return;

    const handleNewChat = (newChat: ChatType) => {
      console.log("Recieved new chat", newChat);
      addNewChat(newChat);
    };

    socket.on("chat:new", handleNewChat);

    return () => {
      socket.off("chat:new", handleNewChat);
    };
  }, [addNewChat, socket]); // explique a chaque fois ceci marche et que est qu il fait et pourquoi on fait comme ca ? et pq on use useEfect ?

  useEffect(() => {
    if (!socket) return;

    const handleChatUpdate = (data: {
      chatId: string;
      lastMessage: MessageType;
    }) => {
      console.log("Recieved update on chat", data.lastMessage);
      updateChatLastMessage(data.chatId, data.lastMessage);
    };

    socket.on("chat:update", handleChatUpdate);

    return () => {
      socket.off("chat:update", handleChatUpdate);
    };
  }, [socket, updateChatLastMessage]); // explique a chaque fois ceci marche et que est qu il fait et pourquoi on fait comme ca ? et pq on use useEfect ?

  const onRoute = (id: string) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div
      className="fixed inset-y-0
      pb-20 lg:pb-0
      lg:max-w-[379px]
      lg:block
      border-r
      border-border
      bg-sidebar
      max-w-[calc(100%-40px)]
      w-full
      left-10
      z-[98]
    "
    >
      <div className="flex-col">
        <ChatListHeader onSearch={setSearchQuery} /> {/* onSearch c est quoi ? */}
        <div
          className="
         flex-1 h-[calc(100vh-100px)]
         overflow-y-auto        "
        >
          <div className="px-2 pb-10 pt-1 space-y-1">
            {isChatsLoading ? (
              <div className="flex items-center justify-center">
                <Spinner className="w-7 h-7" />
              </div>
            ) : filteredChats?.length === 0 ? (
              <div className="flex items-center justify-center">
                {searchQuery ? "No chat found" : "No chats created"}
              </div>
            ) : (
              filteredChats?.map((chat) => (
                <ChatListItem
                  key={chat._id}
                  chat={chat}
                  currentUserId={currentUserId}
                  onClick={() => onRoute(chat._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;

/** 
 * [ ChatList (La colonne grise à gauche) ]
│
├── [ Zone du HAUT (Fixe) ] ──────────────────────────┐
│   │ <ChatListHeader />                              │
│   │  ├── Texte "Chats"                              │
│   │  ├── Bouton [+] (À droite)                      │
│   │  └── Barre de recherche (En dessous)            │
│   └─────────────────────────────────────────────────┘
│
├── [ Zone du BAS (Défile / Scroll) ] ────────────────┐
│   │ <div className="overflow-y-auto ...">           │
│   │                                                 │
│   │   [ ChatListItem 1 (Jean Dupont) ]              │
│   │   [ ChatListItem 2 (Groupe Projet) ]            │
│   │   [ ChatListItem 3 (Marie Curie) ]              │
│   │   ...                                           │
│   │                                                 │
│   └─────────────────────────────────────────────────┘
*/
