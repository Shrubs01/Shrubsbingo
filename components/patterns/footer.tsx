import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { FaqModal } from "@/components/patterns/faq-modal";
import { LegalModal } from "@/components/patterns/legal-modal";

export function Footer() {
  return (
    <Section bg="dark" padding="none" className="pt-8 pb-2 md:pt-10 md:pb-4 border-t border-[var(--border)]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mb-10 relative z-10">
          
          {/* Brand Col */}
          <div className="flex flex-col">
            <Link href="/" className="inline-block mb-4">
              <img
                src="/meenu-logo.png"
                alt="Shrubs Bingo Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-[var(--white)] opacity-80 text-[0.9375rem] leading-relaxed mb-4 max-w-sm">
              Hyderabad&apos;s first plant-themed bingo. Play, meet new people and take a plant home.
            </p>
            <p className="text-[var(--orange-500)] text-[0.75rem] font-bold tracking-[0.1em] uppercase">
              No Numbers • Just Plants
            </p>
          </div>

          {/* Navigation Col */}
          <div>
            <h3 className="text-[0.875rem] font-bold text-white uppercase tracking-wider mb-4 pt-2">Menu</h3>
            <ul className="space-y-2 text-[0.9375rem] text-[var(--white)] opacity-80">
              <li><Link href="/#how-it-works" className="hover:text-[var(--orange-400)] transition-colors">How to Play</Link></li>
              <li><Link href="/sessions" className="hover:text-[var(--orange-400)] transition-colors">Sessions</Link></li>
              <li><Link href="/quiz" className="hover:text-[var(--orange-400)] transition-colors">Plant Quiz</Link></li>
              <li><Link href="/faq" className="hover:text-[var(--orange-400)] transition-colors">FAQ</Link></li>
              <li>
                <LegalModal docType="privacyPolicy">
                  <button type="button" className="hover:text-[var(--orange-400)] transition-colors text-left cursor-pointer">
                    Privacy Policy
                  </button>
                </LegalModal>
              </li>
              <li>
                <LegalModal docType="termsAndConditions">
                  <button type="button" className="hover:text-[var(--orange-400)] transition-colors text-left cursor-pointer">
                    Terms &amp; Conditions
                  </button>
                </LegalModal>
              </li>
            </ul>
          </div>

          {/* Connect Col */}
          <div>
            <h3 className="text-[0.875rem] font-bold text-white uppercase tracking-wider mb-4 pt-2">Connect</h3>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-5 text-[var(--white)] opacity-90">
              <a href="#" aria-label="Instagram" className="hover:text-[var(--orange-400)] transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.4 5.6 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.6 18.4 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
              </a>
              <a href="#" aria-label="WhatsApp" className="hover:text-[var(--orange-400)] transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>

            {/* Contact Stack */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[0.8125rem] text-[var(--white)] opacity-60 mb-1">Email</p>
                <Link href="/contact" className="text-[0.9375rem] text-[var(--white)] opacity-90 hover:text-[var(--orange-400)] transition-colors">
                  hello@shrubsbingo.com
                </Link>
              </div>
              <div>
                <p className="text-[0.8125rem] text-[var(--white)] opacity-60 mb-1">Location</p>
                <p className="text-[0.9375rem] text-[var(--white)] opacity-90">
                  Hyderabad, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-[0.8125rem] text-[var(--white)] opacity-70">
          <div>
            © {new Date().getFullYear()} Shrubs Bingo. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <LegalModal docType="privacyPolicy">
              <button type="button" className="hover:text-[var(--orange-400)] hover:underline transition-colors cursor-pointer">
                Privacy Policy
              </button>
            </LegalModal>
            <span>•</span>
            <LegalModal docType="termsAndConditions">
              <button type="button" className="hover:text-[var(--orange-400)] hover:underline transition-colors cursor-pointer">
                Terms &amp; Conditions
              </button>
            </LegalModal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
