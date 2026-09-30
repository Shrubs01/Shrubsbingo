"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockLegalDocs } from "@/data/mock";
import { updateLegalDocAction } from "@/app/actions";

export default function AdminLegalPage() {
  const [activeTab, setActiveTab] = useState<"privacyPolicy" | "termsAndConditions">("privacyPolicy");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    privacyPolicy: {
      title: mockLegalDocs.privacyPolicy.title,
      lastUpdated: mockLegalDocs.privacyPolicy.lastUpdated,
      content: mockLegalDocs.privacyPolicy.content,
    },
    termsAndConditions: {
      title: mockLegalDocs.termsAndConditions.title,
      lastUpdated: mockLegalDocs.termsAndConditions.lastUpdated,
      content: mockLegalDocs.termsAndConditions.content,
    },
  });

  const currentDoc = formData[activeTab];

  const handleChange = (field: "title" | "lastUpdated" | "content", value: string) => {
    setFormData({
      ...formData,
      [activeTab]: {
        ...formData[activeTab],
        [field]: value,
      },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateLegalDocAction(activeTab, currentDoc);
      alert(`✅ ${currentDoc.title} updated successfully! The live popup on the website is now updated.`);
    } catch (err) {
      console.error(err);
      alert("Failed to update policy. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)]">
            Policies &amp; Legal Documents
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage your official Privacy Policy and Terms &amp; Conditions. Changes save instantly to website popups and legal footers.
          </p>
        </div>

        {/* Live Website Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live In Website Popups</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("privacyPolicy")}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-[2px] flex items-center gap-2 ${
            activeTab === "privacyPolicy"
              ? "border-[var(--orange-500)] text-[var(--orange-600)] font-bold bg-orange-50/40 rounded-t-lg"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--ink)]"
          }`}
        >
          <span>🔒</span>
          <span>Privacy Policy</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("termsAndConditions")}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-[2px] flex items-center gap-2 ${
            activeTab === "termsAndConditions"
              ? "border-[var(--orange-500)] text-[var(--orange-600)] font-bold bg-orange-50/40 rounded-t-lg"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--ink)]"
          }`}
        >
          <span>📜</span>
          <span>Terms &amp; Conditions</span>
        </button>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="bg-white border border-[var(--border)] rounded-[16px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Document Display Title
            </label>
            <input 
              type="text" 
              value={currentDoc.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Last Updated Label
            </label>
            <input 
              type="text" 
              value={currentDoc.lastUpdated}
              onChange={(e) => handleChange("lastUpdated", e.target.value)}
              placeholder="e.g. October 2026"
              className="px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all"
              required
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Policy Content &amp; Clauses
            </label>
            <span className="text-xs text-[var(--text-muted)]">
              Numbered items (e.g. 1. Heading) will automatically format as section headers in the website modal popup.
            </span>
          </div>
          <textarea 
            value={currentDoc.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className="w-full px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-sm font-mono leading-relaxed focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all min-h-[360px]"
            required
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-control)] flex-wrap gap-4">
          <div className="text-xs text-[var(--text-muted)]">
            💡 Any edits saved here will immediately appear when visitors click <strong>{currentDoc.title}</strong> in the website footer or booking popup.
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="h-12 px-8 rounded-[10px] text-[0.75rem] font-bold uppercase tracking-wider bg-[var(--green-700)] hover:bg-[var(--green-800)] text-white shadow-sm"
          >
            {isSubmitting ? "Saving..." : `Save & Publish ${currentDoc.title}`}
          </Button>
        </div>
      </form>
    </div>
  );
}
