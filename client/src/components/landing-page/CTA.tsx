import { ArrowRight } from "lucide-react";
import { useAuthDialog } from "./AuthDialog";


export function CTA() {
  const { open } = useAuthDialog();
  return (
    <section id="cta" className="relative px-4 py-32">
      <div className="relative mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl glass p-12 md:p-20 text-center">
          <div className="absolute inset-0 gradient-primary opacity-20 animate-aurora bg-[length:200%_200%]" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-[500px] bg-primary/40 blur-[100px] rounded-full" />

          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-balance">
              Ready to chat <br className="hidden sm:block" />
              <span className="gradient-text">like it's 2026?</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto text-balance">
              Join thousands already chatting smarter with Whop and Whop AI. Free forever.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => open("signup")}
                className="group inline-flex items-center gap-2 rounded-full gradient-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-elegant transition-transform hover:scale-105"
              >
                Create your account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#preview"
                className="inline-flex items-center rounded-full border border-border px-7 py-3.5 text-sm font-medium hover:bg-surface-elevated transition-colors"
              >
                Live demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
