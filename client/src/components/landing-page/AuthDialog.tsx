import { createContext, useContext, useState, type ReactNode } from "react";
import { MessageCircle } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";


type Mode = "signin" | "signup";

interface AuthDialogContextValue {
  open: (mode?: Mode) => void;
}

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null);

export function useAuthDialog() {
  const ctx = useContext(AuthDialogContext);
  if (!ctx) throw new Error("useAuthDialog must be used within AuthDialogProvider");
  return ctx;
}

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("signin");

  return (
    <AuthDialogContext.Provider
      value={{
        open: (m = "signin") => {
          setMode(m);
          setIsOpen(true);
        },
      }}
    >
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border bg-card">
          <div className="relative">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-[400px] bg-primary/30 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative p-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary shadow-glow">
                  <MessageCircle className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                  {mode === "signin" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mode === "signin"
                    ? "Sign in to continue to Whop."
                    : "Join Whop and start chatting smarter."}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 rounded-full bg-muted p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={`rounded-full py-1.5 font-medium transition-colors ${
                    mode === "signin"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`rounded-full py-1.5 font-medium transition-colors ${
                    mode === "signup"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign up
                </button>
              </div>

              <div className="mt-6">
                {mode === "signin" ? (
                  <SignIn onSwitch={() => setMode("signup")} />
                ) : (
                  <SignUp onSwitch={() => setMode("signin")} />
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AuthDialogContext.Provider>
  );
}
