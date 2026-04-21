import { MessageCircle, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuthDialog } from "./AuthDialog";

export function Nav() {
  const { theme, setTheme } = useTheme();
  const { open } = useAuthDialog();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav className="glass flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-2.5 animate-fade-in">
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full gradient-primary shadow-glow">
            <MessageCircle className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-base font-semibold tracking-tight">Whop<span className="text-primary">.</span></span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#preview" className="hover:text-foreground transition-colors">Preview</a>
          <a href="#ai" className="hover:text-foreground transition-colors">Whop AI</a>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => open("signin")}
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => open("signup")}
            className="inline-flex items-center rounded-full gradient-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 shadow-glow"
          >
            Get started
          </button>
        </div>
      </nav>
    </header>
  );
}
