import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";

export default function AnswerReview({ answer, index }) {
  return (
    <article className="wa-bubble animate-pop w-full max-w-full">
      <div className="flex items-start gap-2">
        {answer.isCorrect ? (
          <FaCircleCheck className="mt-1 h-4 w-4 shrink-0 text-wa-green" />
        ) : (
          <FaCircleXmark className="mt-1 h-4 w-4 shrink-0 text-red-500" />
        )}
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-wa-text">
            Q{index}. {answer.questionText}
          </p>
          <p className="mt-2 text-sm text-wa-muted">
            <span className="font-medium text-wa-text">Your answer: </span>
            {answer.selectedOptionText}
          </p>
          {!answer.isCorrect && (
            <p className="mt-1 text-sm text-wa-muted">
              <span className="font-medium text-wa-teal">Correct answer: </span>
              {answer.correctOptionText}
            </p>
          )}
          <p className="mt-2 rounded-lg bg-wa-bubble px-3 py-2 text-[13px] text-wa-muted">
            {answer.explanation}
          </p>
        </div>
      </div>
    </article>
  );
}
