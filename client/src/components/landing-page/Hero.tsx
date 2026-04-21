import { ArrowRight, Sparkles } from "lucide-react";
import { useAuthDialog } from "./AuthDialog";


export function Hero() {
  const { open } = useAuthDialog();
  return (
    <section className="relative pt-40 pb-24 px-4 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 gradient-radial-glow" />

      {/* Floating orbs */}
      <div className="absolute top-32 -left-20 h-72 w-72 rounded-full bg-primary/30 blur-[120px] animate-float" />
      <div
        className="absolute top-60 -right-20 h-80 w-80 rounded-full bg-accent/25 blur-[140px] animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Now with Whop AI assistant</span>
          <span className="ml-1 h-1 w-1 rounded-full bg-primary animate-pulse-glow" />
        </div>

        <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-balance animate-fade-in-up">
          Messaging,{" "}
          <span className="gradient-text animate-aurora bg-[length:200%_200%]">
            reimagined
          </span>
          <br />
          with intelligence.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg text-muted-foreground text-balance animate-fade-in-up delay-200">
          Whop is a beautifully crafted chat app powered by an AI assistant that
          drafts, summarizes and answers — right inside your conversations.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up delay-300">
          <button
            type="button"
            onClick={() => open("signup")}
            className="group inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-elegant transition-transform hover:scale-105"
          >
            Start chatting free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={() => open("signin")}
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground hover:bg-surface-elevated transition-colors"
          >
            See it live
          </button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground animate-fade-in delay-500">
          Free forever · No credit card · Available everywhere
        </p>
      </div>
    </section>
  );
}
