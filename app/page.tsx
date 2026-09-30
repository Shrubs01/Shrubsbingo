import { Navbar } from "@/components/patterns/navbar";
import { Hero } from "@/components/patterns/hero";
import { HowToPlay } from "@/components/patterns/how-to-play";
import { Prize } from "@/components/patterns/prize";
import { Sessions } from "@/components/patterns/sessions";
import { FinalCta } from "@/components/patterns/final-cta";
import { Footer } from "@/components/patterns/footer";
import { StickyCtaBar } from "@/components/patterns/sticky-cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowToPlay />
        <Prize />
        <Sessions />
        <FinalCta />
      </main>
      <Footer />
      <StickyCtaBar />
    </>
  );
}
