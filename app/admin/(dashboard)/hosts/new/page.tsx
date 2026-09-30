"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { createHostAction } from "@/app/actions";

export default function CreateHostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    image: "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createHostAction(formData);
      if (res.success) {
        router.push("/admin/hosts");
        router.refresh();
      } else {
        alert("Failed to create host: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error creating host: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/hosts" className="text-[0.875rem] text-[var(--orange-600)] hover:underline font-semibold tracking-wider uppercase">
          ← Back to Hosts
        </Link>
      </div>

      <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)] mb-8">
        Add New Host
      </h1>

      <form onSubmit={handleSave} className="bg-white border border-[var(--border)] rounded-[12px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-medium text-[var(--ink)]">Host Name</label>
          <input 
            type="text" 
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="px-4 py-3 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)]"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-medium text-[var(--ink)]">Role</label>
          <input 
            type="text" 
            placeholder="e.g. Bingo Master"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="px-4 py-3 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)]"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-medium text-[var(--ink)]">Bio</label>
          <textarea 
            placeholder="Write a short, funny bio..."
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="px-4 py-3 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)] min-h-[100px]"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-medium text-[var(--ink)]">Profile Image URL</label>
          <input 
            type="url" 
            placeholder="https://..."
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            className="px-4 py-3 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)]"
            required
          />
        </div>

        {formData.image && (
          <div className="mt-2">
            <p className="text-[0.75rem] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2">Image Preview</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded-full border border-[var(--border)]" />
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <Link href="/admin/hosts" className="flex-1">
            <Button type="button" variant="outline" className="w-full h-12">Cancel</Button>
          </Link>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 h-12 uppercase tracking-widest font-semibold bg-[var(--green-600)] hover:bg-[var(--green-700)] text-white"
          >
            {isSubmitting ? "Adding..." : "Add Host"}
          </Button>
        </div>
      </form>
    </div>
  );
}
