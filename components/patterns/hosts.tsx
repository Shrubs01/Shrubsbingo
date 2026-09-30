import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { mockHosts, mockVenue } from "@/data/mock";

export function Hosts() {
  return (
    <Section id="hosts" bg="dark" padding="none">
      <div className="relative w-full overflow-hidden min-h-[600px] flex items-center py-16 md:py-24">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${mockVenue.image})` }}
        />

        <Container className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Left Side: Venue Info */}
            <div className="flex flex-col gap-6 text-white">
              <div className="flex flex-col gap-3">
                <div className="h-[3px] w-[32px] rounded-full bg-[var(--green-400)]" />
                <span className="text-[13px] font-medium tracking-[0.12em] uppercase text-white/70">
                  The Venue
                </span>
                <h2 className="text-[clamp(2rem,2vw+2rem,3.5rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
                  {mockVenue.name}
                </h2>
              </div>
              
              <div className="max-w-md flex flex-col gap-4">
                <p className="text-[16px] text-white/80 leading-relaxed">
                  {mockVenue.address}
                </p>
                <div className="flex mt-2">
                  <a 
                    href={mockVenue.mapsLink} 
                    className="text-[15px] text-white hover:text-[var(--green-300)] font-medium underline underline-offset-4 transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side: Hosts */}
            <div className="flex flex-col">
              <div className="flex flex-col gap-3 mb-8">
                <div className="h-[3px] w-[32px] rounded-full bg-[var(--orange-400)]" />
                <span className="text-[13px] font-medium tracking-[0.12em] uppercase text-white/70">
                  Your Hosts
                </span>
                <h2 className="text-[clamp(1.75rem,1.5vw+1.5rem,2.5rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-white">
                  The plant parents.
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mockHosts.map((host) => (
                  <div key={host.id} className="flex flex-col bg-white border border-gray-100 rounded-[4px] overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <img 
                      src={host.image} 
                      alt={host.name}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-semibold text-[20px] text-[var(--ink)] mb-1">{host.name}</h3>
                      <p className="text-[14px] text-[var(--orange-600)] font-medium mb-3">{host.role}</p>
                      <p className="text-[14px] text-[var(--text-muted)] leading-relaxed">{host.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </div>
    </Section>
  );
}
