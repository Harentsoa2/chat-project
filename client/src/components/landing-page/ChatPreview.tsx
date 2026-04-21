import { Search, Paperclip, Send, Edit3, MessageCircle, Moon } from "lucide-react";

const conversations = [
  { name: "Harena", last: "salut 👋", time: "3/28", unread: 2, active: true, color: "from-primary to-accent" },
  { name: "Whop AI", last: "Je suis là ! Comment puis-je t'aider ?", time: "2/12", unread: 0, ai: true },
  { name: "Marcus Chen", last: "see you tomorrow", time: "2/10", unread: 0 },
  { name: "Design team", last: "new mockups uploaded", time: "1/30", unread: 5 },
];

export function ChatPreview() {
  return (
    <section id="preview" className="relative px-4 pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">The interface</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            Crafted for focus.<br />
            <span className="text-muted-foreground">Built for speed.</span>
          </h2>
        </div>

        {/* App mockup */}
        <div className="relative mx-auto max-w-5xl animate-scale-in">
          {/* Glow */}
          <div className="absolute -inset-4 gradient-primary opacity-20 blur-3xl rounded-[2rem]" />

          <div className="relative rounded-2xl glass shadow-elegant overflow-hidden border border-border">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/80">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex-1 text-center text-xs text-muted-foreground">whop.app</div>
            </div>

            <div className="flex h-[560px]">
              {/* Rail */}
              <div className="hidden sm:flex w-14 flex-col items-center gap-4 border-r border-border bg-surface/50 py-4">
                <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                  <MessageCircle className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="h-px w-8 bg-border" />
                <div className="mt-auto flex flex-col gap-3">
                  <button className="h-8 w-8 rounded-lg bg-surface-elevated flex items-center justify-center text-muted-foreground">
                    <Moon className="h-4 w-4" />
                  </button>
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">H</div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="hidden md:flex w-72 flex-col border-r border-border">
                <div className="flex items-center justify-between px-4 py-4">
                  <h3 className="text-lg font-semibold">Chat</h3>
                  <button className="h-8 w-8 rounded-lg hover:bg-surface-elevated flex items-center justify-center text-muted-foreground">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-3 pb-3">
                  <div className="flex items-center gap-2 rounded-lg bg-surface-elevated px-3 py-2 text-sm text-muted-foreground">
                    <Search className="h-3.5 w-3.5" />
                    <span>Search...</span>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden px-2 space-y-1">
                  {conversations.map((c, i) => (
                    <div
                      key={c.name}
                      className={`flex items-center gap-3 rounded-lg p-2 cursor-pointer transition-colors ${
                        c.active ? "bg-surface-elevated" : "hover:bg-surface-elevated/60"
                      }`}
                      style={{ animation: "fade-in 0.5s ease-out forwards", animationDelay: `${0.4 + i * 0.1}s`, opacity: 0 }}
                    >
                      <div className={`relative h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                        c.ai ? "bg-gradient-to-br from-cyan-400 via-primary to-accent" : "bg-gradient-to-br from-primary/40 to-accent/40 text-foreground"
                      }`}>
                        {!c.ai && c.name.charAt(0)}
                        {c.ai && <Sparkle />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{c.name}</span>
                          <span className="text-[10px] text-muted-foreground">{c.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{c.last}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversation */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 border-b border-border px-5 py-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 via-primary to-accent flex items-center justify-center">
                    <Sparkle />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Whop AI</div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online · always-on
                    </div>
                  </div>
                </div>

                <div className="flex-1 px-5 py-6 space-y-4 overflow-hidden">
                  <Bubble side="left" delay={600}>Hey! I'm Whop AI. Need help drafting a reply, summarizing a thread, or just brainstorming?</Bubble>
                  <Bubble side="right" delay={1200}>Summarize my last 10 messages with Harena please</Bubble>
                  <Bubble side="left" delay={1900} ai>
                    <div className="space-y-1.5">
                      <div className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wide">Summary</div>
                      <p>You're planning a Friday meet-up at 7pm. Harena will bring the slides, you handle the venue. She's waiting on a confirmation.</p>
                    </div>
                  </Bubble>
                  <TypingBubble delay={2800} />
                </div>

                <div className="border-t border-border px-4 py-3">
                  <div className="flex items-center gap-2 rounded-xl bg-surface-elevated px-3 py-2">
                    <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 text-sm text-muted-foreground">Type new message</span>
                    <button className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                      <Send className="h-3.5 w-3.5 text-primary-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
      <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
    </svg>
  );
}

function Bubble({
  children,
  side,
  delay,
  ai,
}: {
  children: React.ReactNode;
  side: "left" | "right";
  delay: number;
  ai?: boolean;
}) {
  const isRight = side === "right";
  return (
    <div
      className={`flex ${isRight ? "justify-end" : "justify-start"}`}
      style={{ opacity: 0, animation: `fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards`, animationDelay: `${delay}ms` }}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
          isRight
            ? "gradient-primary text-primary-foreground rounded-br-sm shadow-glow"
            : ai
            ? "bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/30 text-foreground rounded-bl-sm"
            : "bg-surface-elevated text-foreground rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function TypingBubble({ delay }: { delay: number }) {
  return (
    <div
      className="flex justify-start"
      style={{ opacity: 0, animation: `fade-in 0.4s ease-out forwards`, animationDelay: `${delay}ms` }}
    >
      <div className="bg-surface-elevated rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-typing-dot" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-typing-dot" style={{ animationDelay: "0.2s" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-typing-dot" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
}
