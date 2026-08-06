import { FaCircleCheck, FaLock } from "react-icons/fa6";

export default function LoginIntro({ total }) {
  return (
    <header className="bg-wa-tealDark px-5 pb-6 pt-7 text-white">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <div className="flex items-center gap-3">
          <img src="/images/logo.svg" alt="QuizChat logo" className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-semibold leading-tight">QuizChat</h1>
            <p className="text-xs text-white/70">Chat-style practice quizzes</p>
          </div>
        </div>
        <p className="text-sm text-white/80">
          Pick one of the {total} demo profiles to continue. No password needed — authentication is
          simulated for this prototype.
        </p>
        <div className="flex flex-wrap gap-4 text-[11px] text-white/70">
          <span className="inline-flex items-center gap-1">
            <FaLock className="h-3 w-3" /> Dummy login
          </span>
          <span className="inline-flex items-center gap-1">
            <FaCircleCheck className="h-3 w-3" /> No negative marking
          </span>
        </div>
      </div>
    </header>
  );
}
