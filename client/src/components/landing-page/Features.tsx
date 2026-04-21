import { Sparkles, Zap, Shield, MessageSquare, Globe, Bot } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Whop AI inside",
    desc: "An assistant that understands context. Summarize threads, draft replies, translate on the fly.",
  },
  {
    icon: Zap,
    title: "Instant by design",
    desc: "Sub-50ms message delivery. Optimistic UI. It feels local because it almost is.",
  },
  {
    icon: Shield,
    title: "End-to-end private",
    desc: "Your conversations are encrypted. Even we can't read them. AI runs on opt-in only.",
  },
  {
    icon: MessageSquare,
    title: "Threaded conversations",
    desc: "Reply to any message in a focused side-thread. Keep the main chat clean.",
  },
  {
    icon: Globe,
    title: "Available everywhere",
    desc: "Web, macOS, Windows, iOS, Android. Pick up exactly where you left off.",
  },
  {
    icon: Sparkles,
    title: "Beautifully dark",
    desc: "A handcrafted dark theme tuned for long sessions. Your eyes will thank you.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-4 py-32">
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Everything you need</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            A messenger that{" "}
            <span className="gradient-text">thinks with you.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative rounded-2xl glass p-6 hover:bg-surface-elevated transition-all duration-300 hover:-translate-y-1"
                style={{ opacity: 0, animation: `fade-in-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards`, animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity gradient-primary blur-xl -z-10" style={{ opacity: 0 }} />

                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
                  <Icon className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
                </div>
                <h3 className="text-base font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
