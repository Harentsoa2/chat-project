import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { Server, type Socket } from "socket.io";
import { Env } from "../config/env.config";
import { validateChatParticipant } from "../services/chat.service";

interface AuthenticatedSocket extends Socket {
  userId?: string;
} /// pour besoin de ca alors d ou viens ceci , car io.use(async (socket: AuthenticatedSocket, next) est appeler par qui ? et qui met les parametre

let io: Server | null = null; // io c est quoi

const onlineUsers = new Map<string, string>();

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: Env.FRONTEND_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie || "";

      const cookies = Object.fromEntries(
        rawCookie.split(";").map((pair) => {
          const [key, ...v] = pair.trim().split("=");
          return [key, v.join("=")];
        }),
      );
      const token = cookies["accessToken"];

      if (!token) return next(new Error("Unauthorized"));

      const decodedToken = jwt.verify(token, Env.JWT_SECRET) as {
        // verifie le cookie
        userId: string;
      };
      if (!decodedToken) return next(new Error("Unauthorized"));

      socket.userId = decodedToken.userId; // ???
      next();
    } catch (error) {
      next(new Error("Internal server error"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.userId!; // ??
    const newSocketId = socket.id; // ??
    if (!socket.userId) {
      socket.disconnect(true);
      return;
    }

    //register socket for the user
    onlineUsers.set(userId, newSocketId);

    //BroadCast online users to all socket
    io?.emit("online:users", Array.from(onlineUsers.keys())); // la dedabs tous les online users // mais pourquoi 2 identifiants userId et newSocletId et our vient le userId et new SocketId

    //create personnal room for user
    socket.join(`user:${userId}`); // pour que seule un userId puisse acceder au notification par exemple ?

    socket.on(
      // diff socket join et soncket on et io?.emit ?

      "chat:join", // c est quoi ca , diff "chat:join" et "chat:leave"
      async (chatId: string, callback?: (err?: string) => void) => {
        // pourquoi ? callback?: (err?: string) => void et d ou vient chatId et userId
        try {
          await validateChatParticipant(chatId, userId); // verifie
          console.log(
            `User ${userId} is a participant of chat ${chatId}, joining room...`,
          );
          socket.join(`chat:${chatId}`); // create a room for each chat, mais commne on fait que chaque userID soitn dans le room chat correspondant a son chat ?
          console.log(`User ${userId} join room chat:${chatId}`);

          callback?.(); // pourquoi plusique callback ?
        } catch (error) {
          callback?.("Error joining chat");
        }
      },
    );

    socket.on("chat:leave", (chatId: string) => {
      if (chatId) {
        socket.leave(`chat:${chatId}`);
        console.log(`User ${userId} left room chat:${chatId}`);
      }
    });

    socket.on("disconnect", () => {
      // diff chat:leave et disconnect
      if (onlineUsers.get(userId) === newSocketId) {
        if (userId) onlineUsers.delete(userId); // expliquer cette if ... => .....

        io?.emit("online:users", Array.from(onlineUsers.keys())); // pourquoi emut ici ?

        console.log("socket disconnected", {
          userId,
          newSocketId,
        }); // qu est ce qu on affiche
      }
    });
  });
};

// frontend socket.emit("chat:join", ...)

function getIO() {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}

export const emitNewChatToParticpants = (
  participantIds: string[] = [],
  chat: any,
) => {
  const io = getIO();
  for (const participantId of participantIds) {
    io.to(`user:${participantId}`).emit("chat:new", chat);
  }
};

// lorsque io.to(`user:${participantId}`) est un socket actif des la connection
// appelle dans le frontend : socket.on("chat:new", (chat) => {
//  console.log("Nouveau chat reçu :", chat);
// Mettre à jour l'interface, afficher le nouveau chat }

export const emitNewMessageToChatRoom = (
  senderId: string, //userId that sent the message
  chatId: string,
  message: any,
) => {
  const io = getIO();
  const senderSocketId = onlineUsers.get(senderId?.toString()); // socket id de l user sender pour expect

  console.log(senderId, "senderId");
  console.log(senderSocketId, "sender socketid exist");
  console.log("All online users:", Object.fromEntries(onlineUsers));

  if (senderSocketId) {
    io.to(`chat:${chatId}`).except(senderSocketId).emit("message:new", message);
  } else {
    io.to(`chat:${chatId}`).emit("message:new", message);
  }
};

export const emitLastMessageToParticipants = (
  participantIds: string[],
  chatId: string,
  lastMessage: any,
) => {
  const io = getIO();
  const payload = { chatId, lastMessage };

  for (const participantId of participantIds) {
    io.to(`user:${participantId}`).emit("chat:update", payload);
  }
};

export const emitChatAI = ({
  chatId,
  chunk = null,
  sender, 
  done = false,
  message = null,
}: {
  chatId: string;
  chunk?: string | null;
  sender?: any;
  done?: boolean;
  message?: any;
}) => {
  const io = getIO();
  if (chunk?.trim() &&  !done) {
    io.to(`chat:${chatId}`).emit("chat:ai", {
      chatId,
      chunk,
      done,
      message: null,
      sender
    });
    return; 
  }

  if (done) {
    io.to(`chat:${chatId}`).emit("chat:ai", {
      chatId,
      chunk: null,
      done,
      message,
      sender
    });
    return; 
  }


}