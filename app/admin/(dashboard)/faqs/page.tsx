import Link from "next/link";
import { mockFaqs } from "@/data/mock";
import { Button } from "@/components/ui/button";

export default function AdminFaqsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)]">
          FAQs Directory
        </h1>
        <Link href="/admin/faqs/new">
          <Button className="uppercase tracking-widest font-semibold bg-[var(--orange-500)] hover:bg-[var(--orange-600)] text-white">
            + Add FAQ
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {mockFaqs.map((faq, index) => (
          <div 
            key={faq.id || index}
            className="bg-white border border-[var(--border)] rounded-[12px] shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex-1">
              <h3 className="font-bold text-[1.25rem] text-[var(--ink)] mb-2">Q: {faq.question}</h3>
              <p className="text-[0.9375rem] text-[var(--text-muted)]">A: {faq.answer}</p>
            </div>
            
            <div className="flex-shrink-0">
              <Link href={`/admin/faqs/${faq.id || index}/edit`}>
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
