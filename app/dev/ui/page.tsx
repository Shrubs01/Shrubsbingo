"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function DevUI() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--white)] pb-32">
      <div className="bg-[var(--ink)] text-[var(--white)] p-4 sticky top-0 z-[100] flex justify-between items-center shadow-lg">
        <h1 className="font-semibold text-lg tracking-wide">UI Style Guide</h1>
        <div className="flex gap-4 items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-[var(--ink)] bg-white hover:bg-gray-100"
            onClick={() => setShowOverlay(!showOverlay)}
          >
            {showOverlay ? "Hide Grid Overlay" : "Show Grid Overlay"}
          </Button>
        </div>
      </div>

      <Container className="pt-12 flex flex-col gap-16">
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--heading)] border-b pb-2">Buttons</h2>
          <div className="flex flex-col gap-8">
            {/* Primary */}
            <div className="flex flex-wrap gap-4 items-center">
              <span className="w-32 text-sm font-medium text-[var(--text-muted)]">Primary</span>
              <Button size="sm">Small 36px</Button>
              <Button size="default">Default 44px</Button>
              <Button size="lg">Large 52px</Button>
              <Button disabled>Disabled</Button>
            </div>
            {/* Secondary */}
            <div className="flex flex-wrap gap-4 items-center">
              <span className="w-32 text-sm font-medium text-[var(--text-muted)]">Secondary</span>
              <Button variant="secondary" size="sm">Small 36px</Button>
              <Button variant="secondary" size="default">Default 44px</Button>
              <Button variant="secondary" size="lg">Large 52px</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
            {/* Outline */}
            <div className="flex flex-wrap gap-4 items-center">
              <span className="w-32 text-sm font-medium text-[var(--text-muted)]">Outline</span>
              <Button variant="outline" size="default">Outline Button</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
            </div>
            {/* Ghost */}
            <div className="flex flex-wrap gap-4 items-center p-4 bg-gray-300 rounded-md relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600&h=600')] bg-cover opacity-50" />
              <span className="w-32 text-sm font-medium text-[var(--ink)] relative z-10">Ghost (on media)</span>
              <Button variant="ghost" className="relative z-10">Ghost Button</Button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--heading)] border-b pb-2">Typography (Poppins)</h2>
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-[12px] text-gray-500 mb-1">Display (Hero) - 600 weight</div>
              <div className="text-[clamp(2.5rem,1.4rem+5.2vw,5rem)] font-[600] leading-[1.05] tracking-[-0.03em] text-[var(--ink)]">
                WHAT IF BINGO GREW LEAVES?
              </div>
            </div>
            <div>
              <div className="text-[12px] text-gray-500 mb-1">H2 (Section titles) - 600 weight</div>
              <div className="text-[clamp(1.75rem,1.3rem+2vw,2.5rem)] font-[600] leading-[1.15] tracking-[-0.015em] text-[var(--heading)]">
                Four easy steps to your new favourite weekend plan.
              </div>
            </div>
            <div>
              <div className="text-[12px] text-gray-500 mb-1">Body Large (Lede) - 400 weight</div>
              <div className="text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-[1.6] text-[var(--text-muted)]">
                No numbers. Just plants. Come to a café, play, meet new people and take a plant home.
              </div>
            </div>
            <div>
              <div className="text-[12px] text-gray-500 mb-1">Label / Eyebrow - 500 weight</div>
              <div className="text-[13px] font-[500] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                How to play
              </div>
            </div>
          </div>
        </section>

      </Container>

      {/* Grid Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 pointer-events-none flex justify-center">
          <Container className="h-full border-x border-red-500/30 bg-red-500/5">
            <div className="w-full h-full grid grid-cols-12 gap-4 md:gap-6 lg:gap-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-full bg-blue-500/10 border-x border-blue-500/20" />
              ))}
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}
