"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { mockHosts, Host } from "@/data/mock";
import { updateHostAction, deleteHostAction, getHostsAction } from "@/app/actions";

export default function EditHostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [host, setHost] = useState<Host | undefined>(() => mockHosts.find(h => h.id === id));
  const [isLoading, setIsLoading] = useState(!host);
  
  const [formData, setFormData] = useState({
    name: host?.name || "",
    role: host?.role || "",
    bio: host?.bio || "",
    image: host?.image || "",
  });

  useEffect(() => {
    if (!host) {
      getHostsAction().then(allHosts => {
        const found = allHosts.find(h => h.id === id);
        if (found) {
          setHost(found);
          setFormData({
            name: found.name,
            role: found.role,
            bio: found.bio,
            image: found.image,
          });
        }
        setIsLoading(false);
      });
    }
  }, [id, host]);

  if (isLoading) {
    return <div className="p-12 text-center text-[var(--text-muted)]">Loading host details...</div>;
  }

  if (!host) {
    return <div className="p-12 text-center text-[var(--text-muted)]">Host not found.</div>;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateHostAction(id, formData);
      if (res.success) {
        router.push("/admin/hosts");
        router.refresh();
      } else {
        alert("Failed to update host: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error updating host: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this host?")) {
      setIsDeleting(true);
      try {
        const res = await deleteHostAction(id);
        if (res.success) {
          router.push("/admin/hosts");
          router.refresh();
        } else {
          alert("Failed to delete host.");
        }
      } catch (err: any) {
        alert("Error deleting host: " + err.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/hosts" className="text-[0.875rem] text-[var(--orange-600)] hover:underline font-semibold tracking-wider uppercase">
          ← Back to Hosts
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)]">
          Edit Host
        </h1>
        <Button 
          variant="outline" 
          disabled={isDeleting || isSubmitting}
          className="text-[var(--error)] border-[var(--error)] hover:bg-red-50 hover:text-[var(--error)]" 
          onClick={handleDelete}
        >
          {isDeleting ? "Deleting..." : "Delete Host"}
        </Button>
      </div>

      <form onSubmit={handleUpdate} className="bg-white border border-[var(--border)] rounded-[12px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-medium text-[var(--ink)]">Host Name</label>
          <input 
            type="text" 
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
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="px-4 py-3 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)]"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-medium text-[var(--ink)]">Bio</label>
          <textarea 
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
            disabled={isSubmitting || isDeleting}
            className="flex-1 h-12 uppercase tracking-widest font-semibold bg-[var(--green-600)] hover:bg-[var(--green-700)] text-white"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
