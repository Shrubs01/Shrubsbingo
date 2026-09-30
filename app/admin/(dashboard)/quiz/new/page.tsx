"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createQuizQuestionAction } from "@/app/actions";

export default function CreateQuizPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    answerIndex: 0,
  });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.options.some(opt => !opt.trim())) {
      alert("Please fill in all 4 options.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createQuizQuestionAction(formData);
      alert("Question Added Successfully! It is now live in the Plant Quiz on the website.");
      router.push("/admin/quiz");
    } catch (err) {
      console.error(err);
      alert("Failed to add question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/quiz" className="text-[0.875rem] text-[var(--orange-600)] hover:underline font-semibold tracking-wider uppercase">
          ← Back to Quiz
        </Link>
      </div>

      <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)] mb-8">
        Add New Question
      </h1>

      <form onSubmit={handleSave} className="bg-white border border-[var(--border)] rounded-[12px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Question text</label>
          <input 
            type="text" 
            placeholder="e.g. Which plant is known as the Swiss Cheese Plant?"
            value={formData.question}
            onChange={(e) => setFormData({...formData, question: e.target.value})}
            className="px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all placeholder:text-[var(--text-muted)]/50"
            required
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Multiple Choice Options</label>
          {formData.options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input 
                type="radio" 
                name="correctAnswer" 
                checked={formData.answerIndex === idx}
                onChange={() => setFormData({...formData, answerIndex: idx})}
                className="w-5 h-5 accent-emerald-600 cursor-pointer shrink-0"
              />
              <input 
                type="text" 
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-sm font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all"
                required
              />
              {formData.answerIndex === idx && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md shrink-0">
                  Correct Answer
                </span>
              )}
            </div>
          ))}
          <p className="text-[0.75rem] text-[var(--text-muted)] mt-1">Select the radio button next to the correct answer.</p>
        </div>

        <div className="flex gap-4 mt-4 pt-4 border-t border-[var(--border-control)]">
          <Link href="/admin/quiz" className="flex-1">
            <Button type="button" variant="outline" className="w-full h-12 rounded-[10px] text-[0.75rem] font-bold uppercase tracking-wider border-[var(--border-control)]">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-[10px] text-[0.75rem] font-bold uppercase tracking-wider bg-[var(--green-700)] hover:bg-[var(--green-800)] text-white shadow-sm"
          >
            {isSubmitting ? "Adding..." : "Add Question & Publish"}
          </Button>
        </div>
      </form>
    </div>
  );
}
