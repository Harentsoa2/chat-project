import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { ChatPreview } from "./ChatPreview";
import { Features } from "./Features";
import { AISection } from "./AISection";
import { CTA } from "./CTA";
import { Footer } from "./Footer";
import { AuthDialogProvider } from "./AuthDialog";


export default function LandingPage() {
  return (
    <AuthDialogProvider>
      <div className="min-h-screen bg-background text-foreground noise overflow-hidden">
        <Nav />
        <Hero />
        <ChatPreview />
        <Features />
        <AISection />
        <CTA />
        <Footer />
      </div>
    </AuthDialogProvider>
  );
}
