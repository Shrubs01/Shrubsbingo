"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createFaqAction } from "@/app/actions";

export default function CreateFaqPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createFaqAction(formData);
      alert("FAQ Added Successfully! It is now live on the website.");
      router.push("/admin/faqs");
    } catch (err) {
      console.error(err);
      alert("Failed to add FAQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/faqs" className="text-[0.875rem] text-[var(--orange-600)] hover:underline font-semibold tracking-wider uppercase">
          ← Back to FAQs
        </Link>
      </div>

      <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)] mb-8">
        Add New FAQ
      </h1>

      <form onSubmit={handleSave} className="bg-white border border-[var(--border)] rounded-[12px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Question</label>
          <input 
            type="text" 
            placeholder="e.g. Do I need to bring my own bingo dauber?"
            value={formData.question}
            onChange={(e) => setFormData({...formData, question: e.target.value})}
            className="px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all placeholder:text-[var(--text-muted)]/50"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Answer</label>
          <textarea 
            placeholder="Write the clear and concise answer here..."
            value={formData.answer}
            onChange={(e) => setFormData({...formData, answer: e.target.value})}
            className="px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all placeholder:text-[var(--text-muted)]/50 min-h-[140px]"
            required
          />
        </div>

        <div className="flex gap-4 mt-4 pt-4 border-t border-[var(--border-control)]">
          <Link href="/admin/faqs" className="flex-1">
            <Button type="button" variant="outline" className="w-full h-12 rounded-[10px] text-[0.75rem] font-bold uppercase tracking-wider border-[var(--border-control)]">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-[10px] text-[0.75rem] font-bold uppercase tracking-wider bg-[var(--green-700)] hover:bg-[var(--green-800)] text-white shadow-sm"
          >
            {isSubmitting ? "Adding..." : "Add FAQ & Publish"}
          </Button>
        </div>
      </form>
    </div>
  );
}
