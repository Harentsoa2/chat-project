import { io, Socket } from "socket.io-client";
import { create } from "zustand";

const BASE_URL =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "/"; // c est quoi c est url ? a quoi ca sert ? 

interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}

// ou est ce qu on connect avec le backend ou socket backend ? 

export const useSocket = create<SocketState>()((set, get) => ({ // c est quoi set et get
  socket: null,
  onlineUsers: [],

  connectSocket: () => {
    const { socket } = get(); // pourquoi get ? on peut avoir socket
    console.log(socket, "socket dans le hook");
    if (socket?.connected) return;

    const newSocket =  io(BASE_URL, {
      withCredentials: true,
      autoConnect: true,
    });
    
    // ou est ce qu on peu avoir les credential

    set({ socket: newSocket }); 
    console.log(newSocket, "newSocket dans le hook");
    
    newSocket.on("connect", () => {
      console.log("Socket connected", newSocket.id);
    });

    newSocket.on("online:users", (userIds) => {
      console.log("Online users", userIds);
      set({ onlineUsers: userIds });
    }); // pourquoi le set devient un simple tableaux 
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
