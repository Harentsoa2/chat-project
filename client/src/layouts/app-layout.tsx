import AppWrapper from "@/components/app-wrapper";
import ChatList from "@/components/chat/chat-list";
import useChatId from "@/hooks/use-chat-id";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const chatId = useChatId();
  return (
    <AppWrapper>
      <div className="h-full">
        {/* ChatList */}
        <div className={cn(chatId ? "hidden lg:block" : "block")}>
          <ChatList />
        </div>
        <div
          className={cn(
            "lg:!pl-95 pl-7",
            !chatId ? "hidden lg:block" : "block"
          )}
        >
          <Outlet />
        </div>
      </div>
    </AppWrapper>
  );
};

/**
 * 
 * [ ÉCRAN COMPLET ]
│
├── [ AppWrapper ] (Gère le layout global)
│    │
│    ├── [ AsideBar ] (Bande fine à gauche : 44px)
│    │    ├── Logo
│    │    └── Avatar/Darkmode
│    │
│    └── [ main ] (Le reste de l'écran, décalé de 44px)
│         │
│         └── [ AppLayout ] (Gère la logique Liste vs Chat)
│              │
│              ├── [ Div 1 ] -> <ChatList /> (Liste des amis, visible à gauche)
│              │
│              └── [ Div 2 ] -> <Outlet /> (Zone principale à droite)
│                   │
│                   └── (Si URL est "/") -> Rend le composant <Chat />
│                        │
│                        └── <EmptyState /> ("Cliquez sur un ami...")
 */

export default AppLayout;
