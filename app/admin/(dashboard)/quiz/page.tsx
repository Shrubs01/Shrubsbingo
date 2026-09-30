import Link from "next/link";
import { mockQuizQuestions } from "@/data/mock";
import { Button } from "@/components/ui/button";

export default function AdminQuizPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)]">
          Plant Quiz Editor
        </h1>
        <Link href="/admin/quiz/new">
          <Button className="uppercase tracking-widest font-semibold bg-[var(--orange-500)] hover:bg-[var(--orange-600)] text-white">
            + Add Question
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {mockQuizQuestions.map((q, index) => (
          <div 
            key={q.id || index}
            className="bg-white border border-[var(--border)] rounded-[12px] shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex-1">
              <div className="text-[0.75rem] font-bold text-[var(--orange-600)] uppercase tracking-widest mb-1">Question {index + 1}</div>
              <h3 className="font-bold text-[1.125rem] text-[var(--ink)] mb-3">{q.question}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className={`px-2 py-1.5 rounded-[4px] text-[0.75rem] border ${optIdx === q.answerIndex ? 'bg-[var(--green-50)] border-[var(--green-200)] font-bold text-[var(--green-800)]' : 'bg-white border-[var(--border-control)] text-[var(--text-muted)]'}`}>
                    {opt} {optIdx === q.answerIndex && ' ✓'}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-shrink-0 self-start md:self-center mt-4 md:mt-0">
              <Link href={`/admin/quiz/${q.id || index}/edit`}>
                <Button variant="outline" size="sm" className="w-full md:w-auto uppercase tracking-widest text-[0.7rem] border-[var(--border-control)] font-semibold">
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
