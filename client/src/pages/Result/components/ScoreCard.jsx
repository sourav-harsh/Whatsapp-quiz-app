import { FaCircleCheck, FaCircleXmark, FaTrophy } from "react-icons/fa6";

export default function ScoreCard({ result }) {
  const passed = result.percentage >= 50;
  return (
    <section className="wa-bubble-out animate-pop w-full max-w-full">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-wa-teal text-white">
          <FaTrophy className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">
            {passed ? "Well done!" : "Keep practising"}
          </h2>
          <p className="text-sm text-wa-muted">
            {result.chapterName} · {new Date(result.completedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-white px-2 py-3">
          <p className="text-xl font-bold text-wa-teal">
            {result.score}/{result.total}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-wa-muted">Score</p>
        </div>
        <div className="rounded-xl bg-white px-2 py-3">
          <p className="flex items-center justify-center gap-1 text-xl font-bold text-wa-green">
            <FaCircleCheck className="h-4 w-4" />
            {result.correct}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-wa-muted">Correct</p>
        </div>
        <div className="rounded-xl bg-white px-2 py-3">
          <p className="flex items-center justify-center gap-1 text-xl font-bold text-red-500">
            <FaCircleXmark className="h-4 w-4" />
            {result.wrong}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-wa-muted">Wrong</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-wa-muted">
          <span>Accuracy</span>
          <span>{result.percentage}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white">
          <div
            className={`h-full rounded-full ${passed ? "bg-wa-green" : "bg-orange-400"}`}
            style={{ width: `${result.percentage}%` }}
          />
        </div>
      </div>
    </section>
  );
}
