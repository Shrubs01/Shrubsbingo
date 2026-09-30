"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Static visual component for landing page
export function BingoCardVisual() {
  return (
    <div className="w-full max-w-[500px] mx-auto bg-[var(--green-50)] rounded-xl p-4 sm:p-6 shadow-sm border border-[var(--gray-200)] flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h4 className="text-[20px] font-semibold tracking-[0.1em] text-[var(--green-900)] uppercase">BINGO</h4>
        <div className="text-[14px] font-medium text-[var(--green-600)]">SHRUBS BINGO</div>
      </div>
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {Array.from({ length: 25 }).map((_, i) => (
          <div 
            key={i} 
            className={`aspect-square rounded-md flex items-center justify-center text-[10px] sm:text-[12px] font-medium text-center leading-tight p-1 border transition-colors ${
              i === 12 
                ? 'bg-[var(--green-600)] text-[var(--white)] border-[var(--green-700)]' 
                : [2, 6, 14, 21].includes(i)
                ? 'bg-[var(--orange-500)] text-[var(--ink)] border-[var(--orange-600)] shadow-sm'
                : 'bg-white text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            {i === 12 ? (
              <span>FREE<br/>PLANT</span>
            ) : [2, 6, 14, 21].includes(i) ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            ) : (
              <span className="opacity-40">Leaf</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Interactive component for gameplay
export function InteractiveBingoCard({ plants = [] }: { plants?: { id: string; name: string }[] }) {
  // Center is always free (index 12)
  const [marked, setMarked] = useState<Record<number, boolean>>({ 12: true });

  // Generate a random 5x5 grid if plants are provided, otherwise use placeholders
  const gridCells = Array.from({ length: 25 }).map((_, i) => {
    if (i === 12) return { id: "free", name: "FREE\nPLANT" };
    return plants[i] || { id: `mock-${i}`, name: `Plant ${i}` };
  });

  const toggleMark = (index: number) => {
    if (index === 12) return; // Free space cannot be unmarked
    setMarked(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="w-full max-w-[500px] mx-auto bg-[var(--green-50)] rounded-xl p-4 sm:p-6 shadow-md border-2 border-[var(--green-200)] flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h4 className="text-[24px] font-bold tracking-[0.15em] text-[var(--green-900)] uppercase font-serif">BINGO</h4>
        <div className="text-[14px] font-semibold text-[var(--orange-600)] tracking-widest uppercase">Live Play</div>
      </div>
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {gridCells.map((cell, i) => {
          const isMarked = marked[i];
          const isFree = i === 12;

          return (
            <button
              key={i}
              onClick={() => toggleMark(i)}
              className={cn(
                "relative aspect-square rounded-lg flex items-center justify-center text-[10px] sm:text-[11px] font-medium text-center leading-tight p-1 border-2 transition-all duration-300 transform outline-none focus-visible:ring-2 focus-visible:ring-[var(--orange-500)]",
                isFree
                  ? "bg-[var(--green-600)] text-white border-[var(--green-700)] cursor-default"
                  : isMarked
                  ? "bg-[var(--orange-500)] text-[var(--ink)] border-[var(--orange-600)] scale-95 shadow-inner"
                  : "bg-white text-[var(--ink)] border-[var(--border)] hover:border-[var(--green-300)] hover:bg-[var(--green-50)] shadow-sm active:scale-95"
              )}
            >
              <span className="z-10 px-1 break-words line-clamp-3">{cell.name}</span>
              
              {/* Stamp effect for marked non-free spaces */}
              {isMarked && !isFree && (
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black rotate-[-15deg]">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-2 flex justify-between items-center px-2">
        <p className="text-[12px] text-[var(--text-muted)] font-medium">Tap a square when a plant is called!</p>
        <button 
          onClick={() => setMarked({ 12: true })}
          className="text-[12px] text-[var(--orange-600)] font-semibold hover:underline"
        >
          Reset Board
        </button>
      </div>
    </div>
  );
}
