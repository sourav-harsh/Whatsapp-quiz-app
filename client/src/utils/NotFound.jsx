import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-wa-bg bg-chat-pattern px-4">
      <div className="max-w-sm rounded-2xl bg-white px-6 py-8 text-center shadow-panel">
        <p className="text-5xl font-bold text-wa-teal">404</p>
        <h1 className="mt-3 text-lg font-semibold">This chat doesn&apos;t exist</h1>
        <p className="mt-1 text-sm text-wa-muted">The page you are looking for was moved or deleted.</p>
        <Link to="/exams" className="wa-btn mt-6">
          Back to exams
        </Link>
      </div>
    </div>
  );
}
