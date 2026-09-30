"use client";

import { useRef } from "react";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { motion, useScroll, useTransform } from "framer-motion";

export function HowToPlay() {
  const steps = [
    {
      title: "Get your card",
      desc: "Pick up your plant bingo card when you arrive.",
    },
    {
      title: "Listen & mark",
      desc: "Hear a plant name? Find it on your card and mark it.",
    },
    {
      title: "Call bingo",
      desc: "Complete a pattern, call it out, and win a wishlist plant.",
    },
    {
      title: "Take green home",
      desc: "Everyone leaves with a live plant of their own.",
    },
  ];

  const targetRef = useRef<HTMLDivElement>(null);

  // Track scroll progress as the section passes through the viewport
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 80%", "end 50%"]
  });

  // Fill the line from 0 to 100%
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section id="how-it-works" bg="white">
      <Container>
        <SectionHeader
          align="center"
          eyebrow="How to Play"
          title="Four easy steps to your new favourite weekend plan."
          accentColor="var(--green-500)" // Olive #6B8F52
        />

        <div ref={targetRef} className="flex-1 flex items-center w-full max-w-7xl mx-auto relative mt-6 mb-4">
          
          {/* Horizontal Track Container */}
          <div className="relative w-full">
            
            {/* Background Line constrained exactly between first and last card centers */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[12.5%] right-[12.5%] h-1 bg-gray-200 rounded-full z-0" />
            
            {/* Foreground Animated Line */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[12.5%] right-[12.5%] h-1 z-0">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-[var(--green-400)] rounded-full origin-left"
                style={{ width: lineWidth }}
              />
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10 w-full">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  {/* Card */}
                  <div className="flex flex-col gap-3 bg-[#F8F9FA] p-6 md:p-8 rounded-[4px] border border-gray-100 shadow-sm transition-all hover:shadow-md w-full text-center h-full relative z-10">
                    <h3 className="text-[1.25rem] font-semibold text-[var(--ink)] leading-[1.25]">
                      {step.title}
                    </h3>
                    <p className="text-[15px] text-[var(--text-muted)] leading-[1.6]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </Section>
  );
}



