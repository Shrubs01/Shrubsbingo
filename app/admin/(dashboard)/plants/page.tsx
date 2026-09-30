import Link from "next/link";
import { getPlantsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminPlantsPage() {
  const plants = await getPlantsAction();
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)]">
          Plant Inventory
        </h1>
        <Link href="/admin/plants/new">
          <Button className="uppercase tracking-widest font-semibold bg-[var(--orange-500)] hover:bg-[var(--orange-600)] text-white">
            + New Plant
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plants.map((plant) => (
          <div 
            key={plant.id}
            className="bg-white border border-[var(--border)] rounded-[12px] shadow-sm flex flex-col overflow-hidden"
          >
            <div className="aspect-square bg-gray-200 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-[1.125rem] text-[var(--ink)] mb-1">{plant.name}</h3>
              <p className="text-[0.875rem] text-[var(--text-muted)] line-clamp-2 flex-1">{plant.tag}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-control)] mt-4">
                <Link href={`/admin/plants/${plant.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full uppercase tracking-widest text-[0.7rem] border-[var(--border-control)] font-semibold">
                    Edit Plant
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
