"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { mockEvent } from "@/data/mock";

export function Hero() {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-white">
      {/* Background Video / Poster */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full"
          poster="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260831_223518_f11bfa03-4e65-47e1-a4a7-30e42a7a8c2f.png&w=1920&q=85"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260831_232706_43757be4-2250-4f09-8cd7-23aebbf147ad.mp4"
            type="video/mp4"
          />
        </video>
        
        {/* Pause/Play Control */}
        <button 
          onClick={togglePlay}
          className="absolute bottom-6 right-6 z-30 flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white/72 backdrop-blur-[4px] border border-white text-[var(--ink)] hover:bg-white/88 transition-colors"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
      </div>

      {/* Content */}
      <Container className="relative z-20 pt-20 flex flex-col items-center text-center">
        <div className="mb-6 tracking-[0.12em] uppercase text-[13px] font-medium text-[var(--ink)] bg-white/80 px-4 py-1.5 rounded-full backdrop-blur-md border border-white">
          Hyderabad&apos;s first plant-themed bingo
        </div>

        <h1 className="text-balance text-[var(--ink)] font-[600] tracking-[-0.03em] leading-[1.05] text-[clamp(2.5rem,1.4rem+5.2vw,5rem)] mb-6">
          WHAT IF BINGO GREW LEAVES?
        </h1>

        <p className="text-balance text-[var(--text-muted)] text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-[1.6] mb-10 max-w-[56ch]">
          No numbers. Just plants. Come to a café, play, meet new people and take a plant home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Button asChild size="lg" fullWidth className="sm:w-auto uppercase">
            <Link href="/sessions">Book your spot</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            fullWidth
            className="sm:w-auto uppercase"
          >
            <Link href="/quiz">Which plant are you?</Link>
          </Button>
        </div>


      </Container>
    </section>
  );
}
