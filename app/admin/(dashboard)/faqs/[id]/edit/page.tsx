"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { mockFaqs } from "@/data/mock";
import { updateFaqAction, deleteFaqAction } from "@/app/actions";

export default function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // mock.ts might have index based ID or explicit string ID
  const faq = mockFaqs.find((f, index) => f.id === id || index.toString() === id);
  const faqId = faq?.id || id;
  
  const [formData, setFormData] = useState({
    question: faq?.question || "",
    answer: faq?.answer || "",
  });

  if (!faq) {
    return <div className="p-12 text-center text-[var(--text-muted)]">FAQ not found.</div>;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateFaqAction(faqId, formData);
      alert("FAQ Updated Successfully! Changes are live on the website.");
      router.push("/admin/faqs");
    } catch (err) {
      console.error(err);
      alert("Failed to update FAQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this FAQ? It will be removed from the website.")) {
      setIsSubmitting(true);
      try {
        await deleteFaqAction(faqId);
        alert("FAQ Deleted.");
        router.push("/admin/faqs");
      } catch (err) {
        console.error(err);
        alert("Failed to delete FAQ.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/faqs" className="text-[0.875rem] text-[var(--orange-600)] hover:underline font-semibold tracking-wider uppercase">
          ← Back to FAQs
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)]">
          Edit FAQ
        </h1>
        <Button 
          type="button"
          variant="outline" 
          className="text-[var(--error)] border-[var(--error)] hover:bg-red-50 hover:text-[var(--error)]" 
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          Delete FAQ
        </Button>
      </div>

      <form onSubmit={handleUpdate} className="bg-white border border-[var(--border)] rounded-[12px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Question</label>
          <input 
            type="text" 
            value={formData.question}
            onChange={(e) => setFormData({...formData, question: e.target.value})}
            className="px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Answer</label>
          <textarea 
            value={formData.answer}
            onChange={(e) => setFormData({...formData, answer: e.target.value})}
            className="px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all min-h-[140px]"
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
