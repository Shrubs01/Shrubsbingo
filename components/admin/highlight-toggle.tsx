"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleFeaturedSessionAction } from "@/app/actions";

interface HighlightToggleProps {
  sessionId: string;
  initialFeatured: boolean;
  compact?: boolean;
}

export function HighlightToggle({ sessionId, initialFeatured, compact = false }: HighlightToggleProps) {
  const router = useRouter();
  const [featured, setFeatured] = useState(initialFeatured);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await toggleFeaturedSessionAction(sessionId);
      if (res.success && res.isFeatured !== undefined) {
        setFeatured(res.isFeatured);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to toggle highlight", err);
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        title={featured ? "Remove highlight from website" : "Highlight this session on website"}
        className={`px-2 py-1 rounded-md text-[11px] font-bold tracking-tight transition-all flex items-center gap-1 border shrink-0 ${
          featured
            ? "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700"
        }`}
      >
        <span>{featured ? "⭐" : "☆"}</span>
        <span>{featured ? "Highlighted" : "Highlight"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border shrink-0 ${
        featured
          ? "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200 shadow-sm"
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <span>{featured ? "⭐" : "☆"}</span>
      <span>{featured ? "Highlighted on Site" : "Highlight on Site"}</span>
    </button>
  );
}
