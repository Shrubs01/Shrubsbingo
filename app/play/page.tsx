import { InteractiveBingoCard } from "@/components/patterns/bingo-card";
import { Navbar } from "@/components/patterns/navbar";
import { mockPlants } from "@/data/mock";

export default function PlayPage() {
  // To simulate a full card, we just duplicate the mock plants enough times to fill 24 slots (excluding the free space)
  const fullPlantsList = [...mockPlants, ...mockPlants, ...mockPlants, ...mockPlants, ...mockPlants, ...mockPlants].slice(0, 24);
  
  // Insert a dummy item at index 12 so that the array aligns perfectly with the 25-cell grid
  const gridPlants = [...fullPlantsList.slice(0, 12), { id: 'free', name: 'FREE' }, ...fullPlantsList.slice(12)];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-[2.5rem] md:text-[3.5rem] font-serif font-medium text-[var(--heading)] mb-4">
            Game Time
          </h1>
          <p className="text-[1.125rem] text-[var(--text-muted)] max-w-xl mx-auto">
            When the host calls out a plant, tap the square to mark it off. First to get 5 in a row yells BINGO!
          </p>
        </div>
        
        <div className="flex justify-center">
          <InteractiveBingoCard plants={gridPlants} />
        </div>
      </main>
    </div>
  );
}
