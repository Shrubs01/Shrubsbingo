import { Navbar } from "@/components/patterns/navbar";
import { Footer } from "@/components/patterns/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-0">
        
        {/* Page Header */}
        <Section bg="warm" className="border-b border-[var(--border)]">
          <Container size="narrow" className="text-center">
            <h1 className="text-[var(--heading)] text-[2.5rem] md:text-[3.5rem] font-serif font-medium tracking-wide mb-4">
              Get in Touch
            </h1>
            <p className="text-[var(--text-muted)] text-[1.125rem] md:text-[1.25rem] max-w-2xl mx-auto leading-relaxed">
              Have a question about an upcoming session, want to partner with us, or just want to talk about plants? We'd love to hear from you.
            </p>
          </Container>
        </Section>

        {/* Contact Layout */}
        <Section bg="subtle">
          <Container size="narrow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
              
              {/* Left Side: Contact Info */}
              <div className="flex flex-col">
                <h2 className="text-[2rem] font-serif font-medium text-[var(--heading)] mb-6">
                  Contact Information
                </h2>
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-[0.875rem] font-bold tracking-wider uppercase text-[var(--orange-600)] mb-2">Email</h3>
                    <p className="text-[1.125rem] text-[var(--ink)] font-medium">hello@shrubsbingo.com</p>
                    <p className="text-[0.9375rem] text-[var(--text-muted)] mt-1">We try to reply within 24 hours.</p>
                  </div>
                  <div>
                    <h3 className="text-[0.875rem] font-bold tracking-wider uppercase text-[var(--orange-600)] mb-2">Social</h3>
                    <div className="flex gap-4 mt-2">
                      <a href="#" className="text-[var(--text-muted)] hover:text-[var(--orange-500)] transition-colors underline underline-offset-4">Instagram</a>
                      <a href="#" className="text-[var(--text-muted)] hover:text-[var(--orange-500)] transition-colors underline underline-offset-4">Facebook</a>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[0.875rem] font-bold tracking-wider uppercase text-[var(--orange-600)] mb-2">Primary Venue</h3>
                    <p className="text-[1.125rem] text-[var(--ink)] font-medium">HoshiSasa Cafe</p>
                    <p className="text-[0.9375rem] text-[var(--text-muted)] mt-1 max-w-[250px]">Plot No. 123, Jubilee Enclave, Madhapur, Hyderabad</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Contact Form */}
              <div className="bg-white p-8 rounded-[12px] border border-[var(--border)] shadow-sm">
                <form className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-[0.875rem] font-medium text-[var(--ink)]">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="px-4 py-3 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)] focus:ring-1 focus:ring-[var(--orange-500)] transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[0.875rem] font-medium text-[var(--ink)]">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="px-4 py-3 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)] focus:ring-1 focus:ring-[var(--orange-500)] transition-all"
                      placeholder="Your email address"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-[0.875rem] font-medium text-[var(--ink)]">Message</label>
                    <textarea 
                      id="message" 
                      rows={4}
                      className="px-4 py-3 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)] focus:ring-1 focus:ring-[var(--orange-500)] transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <Button size="lg" className="mt-2 w-full uppercase tracking-wider font-semibold">
                    Send Message
                  </Button>
                </form>
              </div>

            </div>
          </Container>
        </Section>

      </main>
      <Footer />
    </>
  );
}
