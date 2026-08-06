import { FaChevronRight } from "react-icons/fa6";
import Avatar from "./Avatar.jsx";

export default function ListRow({ title, subtitle, meta, icon, color, onClick, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="wa-row animate-pop disabled:opacity-60">
      {icon ? (
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: color || "#128C7E" }}
        >
          {icon}
        </span>
      ) : (
        <Avatar name={title} color={color} />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-wa-text">{title}</span>
        {subtitle && <span className="block truncate text-sm text-wa-muted">{subtitle}</span>}
      </span>
      {meta && <span className="shrink-0 text-xs font-medium text-wa-muted">{meta}</span>}
      <FaChevronRight className="h-3 w-3 shrink-0 text-wa-muted" />
    </button>
  );
}
