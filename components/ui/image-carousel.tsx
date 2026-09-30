"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface CarouselItem {
  title: string;
  image: string;
  subtitle?: string;
}

export function ImageCarousel({ items = [] }: { items?: CarouselItem[] }) {
  const [stopScroll, setStopScroll] = useState(false);

  // If no items, we could fall back or just return empty, but let's map items
  return (
    <>
      <style>{`
        .marquee-inner {
          animation: marqueeScroll linear infinite;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }

          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div
        className="overflow-hidden w-full relative"
        onMouseEnter={() => setStopScroll(true)}
        onMouseLeave={() => setStopScroll(false)}
      >
        <div
          className="marquee-inner flex w-fit"
          style={{
            animationPlayState: stopScroll ? "paused" : "running",
            animationDuration: items.length * 5000 + "ms",
          }}
        >
          <div className="flex">
            {[...items, ...items].map((card, index) => (
              <div
                key={index}
                className="w-48 md:w-56 mx-3 md:mx-4 h-64 md:h-80 relative group hover:scale-95 transition-all duration-300 rounded-[16px] overflow-hidden shadow-sm"
              >
                <img
                  src={card.image}
                  alt="card"
                  className="w-full h-full object-cover"
                />
                <div className="flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-0 backdrop-blur-md left-0 w-full h-full bg-black/40">
                  <p className="text-white text-base md:text-lg font-medium text-center leading-tight">
                    {card.title}
                  </p>
                  {card.subtitle && (
                    <p className="text-white/80 text-xs md:text-sm text-center mt-2">
                      {card.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
