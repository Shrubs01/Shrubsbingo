import Link from "next/link";
import { getHostsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminHostsPage() {
  const hosts = await getHostsAction();
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)]">
          Hosts Directory
        </h1>
        <Link href="/admin/hosts/new">
          <Button className="uppercase tracking-widest font-semibold bg-[var(--orange-500)] hover:bg-[var(--orange-600)] text-white">
            + New Host
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hosts.map((host) => (
          <div 
            key={host.id}
            className="bg-white border border-[var(--border)] rounded-[12px] shadow-sm flex flex-col overflow-hidden p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border border-[var(--border-control)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={host.image} alt={host.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-[1.25rem] text-[var(--ink)]">{host.name}</h3>
                <p className="text-[0.75rem] font-semibold tracking-widest uppercase text-[var(--green-700)] bg-[var(--green-50)] inline-block px-2 py-0.5 rounded-md mt-1">{host.role}</p>
              </div>
            </div>
            
            <p className="text-[0.875rem] text-[var(--text-muted)] flex-1 italic mb-4">&quot;{host.bio}&quot;</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-control)] mt-auto">
              <Link href={`/admin/hosts/${host.id}/edit`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full uppercase tracking-widest text-[0.7rem] border-[var(--border-control)] font-semibold">
                  Edit Host
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
