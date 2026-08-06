import { FaRegFaceFrown } from "react-icons/fa6";

export default function EmptyState({ title = "Nothing here yet", description }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white px-6 py-10 text-center shadow-bubble">
      <FaRegFaceFrown className="h-8 w-8 text-wa-muted" />
      <p className="text-base font-semibold text-wa-text">{title}</p>
      {description && <p className="text-sm text-wa-muted">{description}</p>}
    </div>
  );
}
