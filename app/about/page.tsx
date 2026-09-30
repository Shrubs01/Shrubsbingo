import { Navbar } from "@/components/patterns/navbar";
import { Footer } from "@/components/patterns/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { mockHosts } from "@/data/mock";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-0">
        {/* About Hero */}
        <Section bg="warm" className="border-b border-[var(--border)]">
          <Container size="narrow" className="text-center">
            <h1 className="text-[var(--heading)] text-[2.5rem] md:text-[3.5rem] font-serif font-medium tracking-wide mb-4">
              Our Story
            </h1>
            <p className="text-[var(--text-muted)] text-[1.125rem] md:text-[1.25rem] max-w-2xl mx-auto leading-relaxed">
              We asked ourselves: What if bingo grew leaves? And just like that, a community of plant lovers and game enthusiasts was born in the heart of Hyderabad.
            </p>
          </Container>
        </Section>

        {/* The Concept */}
        <Section>
          <Container size="narrow">
            <div className="bg-white border border-[var(--border)] rounded-[12px] p-8 md:p-12 shadow-sm text-center">
              <h2 className="text-[2rem] font-serif font-medium text-[var(--heading)] mb-6">
                Why Plant Bingo?
              </h2>
              <div className="text-[var(--text-muted)] text-[1rem] leading-relaxed space-y-4 max-w-3xl mx-auto">
                <p>
                  Most bingo nights are about winning cash. We thought it would be much cooler to win something that grows. Shrubs Bingo was created to bring people together in a relaxing, aesthetic environment—away from screens and notifications.
                </p>
                <p>
                  Our events are hosted in cozy, locally-owned cafes where you can grab a coffee, learn a bit about plant care, and scream "BINGO" when you've matched five beautiful monsteras, calatheas, or pothos on your card.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Meet the Hosts */}
        <Section bg="subtle">
          <Container size="narrow">
            <div className="text-center mb-12">
              <div className="h-[3px] w-[32px] rounded-full bg-[var(--orange-400)] mx-auto mb-4" />
              <span className="text-[13px] font-medium tracking-[0.12em] uppercase text-[var(--text-muted)] mb-2 block">
                The Plant Parents
              </span>
              <h2 className="text-[2rem] md:text-[2.5rem] font-serif font-medium text-[var(--heading)]">
                Meet your hosts
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {mockHosts.map((host) => (
                <div key={host.id} className="bg-white border border-[var(--border)] rounded-[12px] overflow-hidden shadow-sm flex flex-col transition-transform hover:-translate-y-1">
                  <div className="w-full h-[300px] overflow-hidden bg-gray-100">
                    <img 
                      src={host.image} 
                      alt={host.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-8 flex flex-col grow">
                    <h3 className="font-semibold text-[1.5rem] text-[var(--ink)] mb-1">{host.name}</h3>
                    <p className="text-[0.9375rem] text-[var(--orange-600)] font-medium tracking-wide uppercase mb-4">{host.role}</p>
                    <p className="text-[1rem] text-[var(--text-muted)] leading-relaxed flex-grow">
                      {host.bio} 
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
