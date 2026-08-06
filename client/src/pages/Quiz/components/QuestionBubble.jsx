import { FaCheckDouble } from "react-icons/fa6";

export default function QuestionBubble({ number, total, text, marks = 1 }) {
  return (
    <article key={number} className="wa-bubble animate-pop">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-wa-teal">
        Question {number} of {total}
      </p>
      <h2 className="text-[15px] font-medium text-wa-text">{text}</h2>
      <p className="mt-2 flex items-center justify-end gap-1 text-[11px] text-wa-muted">
        +{marks} mark · no negative marking
        <FaCheckDouble className="h-3 w-3 text-wa-teal" />
      </p>
    </article>
  );
}
