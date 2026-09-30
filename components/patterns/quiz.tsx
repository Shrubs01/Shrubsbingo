"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { mockQuizQuestions } from "@/data/mock";

const results = [
  {
    plant: "Monstera Deliciosa",
    desc: "You are bold, love making a statement, and thrive with a little bit of attention. The classic Monstera is your perfect match.",
  },
  {
    plant: "Snake Plant",
    desc: "Low maintenance but highly resilient. You don't need much to survive and keep things looking sharp.",
  },
  {
    plant: "Calathea",
    desc: "A bit dramatic but absolutely stunning. You like a routine and thrive in the right environment.",
  },
  {
    plant: "Fiddle Leaf Fig",
    desc: "A true design icon. You appreciate beautiful aesthetics, good light, and a touch of luxury in your space.",
  }
];

export function Quiz() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const questions = mockQuizQuestions;

  const handleSelect = (optionIdx: number) => {
    setAnswers({ ...answers, [currentQ]: optionIdx });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setHasStarted(false);
    setCurrentQ(0);
    setAnswers({});
    setShowResult(false);
  };

  // Score calculation based on questions in mockQuizQuestions
  const correctCount = questions.reduce((count, q, idx) => {
    return answers[idx] === q.answerIndex ? count + 1 : count;
  }, 0);

  const result = results[correctCount % results.length];

  if (!questions || questions.length === 0) {
    return (
      <Section id="quiz" bg="white">
        <Container size="narrow" className="text-center py-12">
          <p className="text-gray-500 font-medium">No quiz questions available right now. Check back soon!</p>
        </Container>
      </Section>
    );
  }

  const currentQuestion = questions[currentQ];

  return (
    <Section id="quiz" bg="white">
      <Container size="narrow">
        {!showResult ? (
          <div className="flex flex-col items-center w-full">
            <SectionHeader
              align="center"
              title="Which plant are you?"
              lede="Answer these quick plant trivia questions to discover your botanical soulmate before booking your spot."
              accentColor="var(--orange-400)"
            />
            
            {!hasStarted ? (
              <div className="text-center mt-2">
                <Button size="lg" onClick={() => setHasStarted(true)} className="uppercase font-bold tracking-wider px-8 bg-[var(--orange-500)] hover:bg-[var(--orange-600)] text-white">
                  Start the quiz ({questions.length} Questions)
                </Button>
              </div>
            ) : (
              <div className="w-full bg-[var(--white)] rounded-[16px] p-6 md:p-8 shadow-sm border border-[var(--border)] mt-4">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-[1.25rem] md:text-[1.375rem] font-semibold text-[var(--ink)] leading-tight pr-4">
                    {currentQuestion.question}
                  </h3>
                  <span className="text-[13px] text-[var(--text-muted)] font-bold bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap shrink-0">
                    {currentQ + 1} / {questions.length}
                  </span>
                </div>
                
                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((opt, optIdx) => {
                    const isSelected = answers[currentQ] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(optIdx)}
                        className={cn(
                          "w-full flex items-center justify-between p-4 md:p-5 rounded-[12px] border transition-all duration-200 text-left",
                          isSelected
                            ? "border-[var(--orange-500)] bg-orange-50 text-[var(--ink)] ring-2 ring-orange-200/50"
                            : "border-[var(--border-control)] hover:border-[var(--orange-300)] text-[var(--text)] hover:bg-gray-50"
                        )}
                      >
                        <span className="font-medium text-[15px] md:text-[16px]">{opt}</span>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ml-3",
                          isSelected ? "border-[var(--orange-600)]" : "border-[var(--gray-300)]"
                        )}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--orange-600)]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleNext}
                    disabled={answers[currentQ] === undefined}
                    size="lg"
                    className="w-full sm:w-auto uppercase font-bold tracking-wider px-8 bg-[var(--orange-500)] hover:bg-[var(--orange-600)] text-white disabled:opacity-50"
                  >
                    {currentQ === questions.length - 1 ? "See My Result & Score" : "Next Question →"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <SectionHeader
              align="center"
              eyebrow="Your Quiz Match"
              title={result.plant}
              lede={result.desc}
              accentColor="var(--orange-400)"
            />
            
            <div className="w-full bg-[var(--green-50)] rounded-[16px] p-8 md:p-12 shadow-sm border border-[var(--border)] text-center flex flex-col items-center mt-4">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#D8ECD9]">
                <span className="text-[40px]">🌿</span>
              </div>
              
              <div className="bg-white px-5 py-2.5 rounded-full border border-[#D8ECD9] text-sm font-bold text-[#1C3B27] mb-6">
                Score: {correctCount} / {questions.length} Correct Answers
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
                <Button asChild size="lg" className="w-full sm:w-auto uppercase font-bold tracking-wider px-8 bg-[var(--orange-500)] hover:bg-[var(--orange-600)] text-white">
                  <Link href="/sessions">Book your spot</Link>
                </Button>
                <Button variant="outline" size="lg" onClick={resetQuiz} className="w-full sm:w-auto font-semibold">
                  Retake Quiz
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
