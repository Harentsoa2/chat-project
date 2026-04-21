import { Sparkles, Wand2, Languages, ListTodo } from "lucide-react";

const capabilities = [
  { icon: Wand2, label: "Draft replies in your voice" },
  { icon: ListTodo, label: "Summarize long threads in seconds" },
  { icon: Languages, label: "Translate across 40+ languages" },
  { icon: Sparkles, label: "Suggest follow-ups, calendar invites & more" },
];

export function AISection() {
  return (
    <section id="ai" className="relative px-4 py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium mb-6">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>Whop AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance mb-6">
            Your assistant lives <span className="gradient-text">inside the chat.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-balance">
            Stop switching tabs. Whop AI is a real conversation in your sidebar — ready to help with anything, with full context of what you're working on.
          </p>

          <ul className="space-y-3">
            {capabilities.map((c, i) => {
              const Icon = c.icon;
              return (
                <li
                  key={c.label}
                  className="flex items-center gap-3 text-sm"
                  style={{ opacity: 0, animation: `fade-in-up 0.6s ease-out forwards`, animationDelay: `${i * 100}ms` }}
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground/90">{c.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* AI Orb */}
        <div className="relative h-96 flex items-center justify-center">
          <div className="absolute h-72 w-72 rounded-full gradient-primary opacity-30 blur-3xl animate-pulse-glow" />
          <div className="relative h-56 w-56 rounded-full bg-gradient-to-br from-cyan-400 via-primary to-accent shadow-elegant animate-float flex items-center justify-center">
            <div className="absolute inset-2 rounded-full bg-background/20 backdrop-blur-xl" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-300/40 to-accent/40 blur-md" />
            <Sparkles className="relative h-16 w-16 text-white drop-shadow-lg" strokeWidth={1.5} />

            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-[float_8s_ease-in-out_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-cyan-400 shadow-glow" />
            </div>
            <div className="absolute inset-0 animate-[float_10s_ease-in-out_infinite_reverse]">
              <div className="absolute bottom-4 right-6 h-2 w-2 rounded-full bg-accent shadow-glow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
