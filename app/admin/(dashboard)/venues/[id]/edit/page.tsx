"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { mockVenues } from "@/data/mock";

export default function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const venue = (mockVenues || []).find(v => v.id === id);
  
  const [formData, setFormData] = useState({
    name: venue?.name || "",
    address: venue?.address || "",
    images: venue?.images || [venue?.image || ""],
    mapsLink: venue?.mapsLink || "",
  });

  if (!venue) {
    return <div className="p-12 text-center text-[var(--text-muted)]">Venue not found.</div>;
  }

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const handleUpdateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Venue Updated Successfully!");
    router.push("/admin/venues");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this venue?")) {
      alert("Venue Deleted.");
      router.push("/admin/venues");
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/venues" className="text-[0.875rem] text-[var(--orange-600)] hover:underline font-semibold tracking-wider uppercase">
          ← Back to Venues
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)]">
          Edit Venue
        </h1>
        <Button variant="outline" className="text-[var(--error)] border-[var(--error)] hover:bg-red-50 hover:text-[var(--error)]" onClick={handleDelete}>
          Delete Venue
        </Button>
      </div>

      <form onSubmit={handleUpdate} className="bg-white border border-[var(--border)] rounded-[12px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-medium text-[var(--ink)]">Venue Name</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="px-4 py-3 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)]"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-medium text-[var(--ink)]">Full Address</label>
          <input 
            type="text" 
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="px-4 py-3 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)]"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-medium text-[var(--ink)]">Google Maps Link</label>
          <input 
            type="url" 
            value={formData.mapsLink}
            onChange={(e) => setFormData({...formData, mapsLink: e.target.value})}
            className="px-4 py-3 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)]"
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--border-control)] pt-6 mt-2">
          <div className="flex justify-between items-center">
            <label className="text-[0.875rem] font-bold uppercase tracking-widest text-[var(--ink)]">Venue Image Gallery</label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddImage} className="text-[0.75rem] border-[var(--border-control)]">
              + Add Image
            </Button>
          </div>

          <div className="grid gap-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-[var(--bg-subtle)] p-4 rounded-lg border border-[var(--border-control)]">
                <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0 border border-[var(--border)]">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[0.6rem] text-gray-400 uppercase">No Img</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <input 
                    type="text" 
                    placeholder="Image URL..."
                    value={img}
                    onChange={(e) => handleUpdateImage(idx, e.target.value)}
                    className="w-full px-3 py-2 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)] text-[0.875rem]"
                    required
                  />
                  {formData.images.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(idx)}
                      className="text-[0.75rem] text-[var(--error)] hover:underline self-start font-semibold uppercase tracking-wider"
                    >
                      Delete Image
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Link href="/admin/venues" className="flex-1">
            <Button type="button" variant="outline" className="w-full h-12">Cancel</Button>
          </Link>
          <Button type="submit" className="flex-1 h-12 uppercase tracking-widest font-semibold bg-[var(--green-600)] hover:bg-[var(--green-700)] text-white">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
