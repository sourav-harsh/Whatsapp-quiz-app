import { FaSpinner } from "react-icons/fa6";

export default function Loader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-wa-bg">
      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-bubble">
        <FaSpinner className="h-4 w-4 animate-spin text-wa-teal" />
        <span className="text-sm text-wa-muted">{label}</span>
      </div>
    </div>
  );
}
