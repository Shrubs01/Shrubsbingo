import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { mockPlants } from "@/data/mock";
import { ImageCarousel } from "@/components/ui/image-carousel";

export function Prize() {
  return (
    <Section id="prize" bg="tint">
      <Container>
        <SectionHeader
          align="center"
          title="Everyone goes home with a plant."
          lede="Win your round to get priority pick from the table, but no matter what, nobody leaves empty-handed."
          accentColor="var(--green-300)" // Sage
        />
      </Container>
      <div className="w-full mt-10">
        {mockPlants.length > 0 ? (
          <ImageCarousel 
            items={mockPlants.map(plant => ({
              title: plant.name,
              image: plant.image,
              subtitle: plant.tag
            }))}
          />
        ) : (
          <div className="text-center py-10 px-4 bg-white/60 border border-[var(--border)] rounded-2xl max-w-md mx-auto">
            <span className="text-3xl mb-2 block">🪴</span>
            <p className="text-sm font-semibold text-[var(--ink)]">Curated Plant Giveaways Coming Soon</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Live potted plants will be revealed as upcoming sessions are scheduled.</p>
          </div>
        )}
      </div>
    </Section>
  );
}
