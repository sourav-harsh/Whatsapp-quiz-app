export default function QuizProgress({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-bubble">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-wa-muted">
        <span>
          Question {current} / {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-wa-bubble">
        <div
          className="h-full rounded-full bg-wa-green transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
