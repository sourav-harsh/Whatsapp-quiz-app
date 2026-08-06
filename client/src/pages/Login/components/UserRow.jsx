import Avatar from "../../../utils/Avatar.jsx";

export default function UserRow({ user, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(user)} className="wa-row animate-pop">
      <Avatar name={user.name} initials={user.initials} color={user.accent} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-[15px] font-semibold text-wa-text">{user.name}</span>
          <span className="shrink-0 text-[11px] text-wa-muted">{user.last_seen}</span>
        </span>
        <span className="block truncate text-sm text-wa-muted">{user.status}</span>
      </span>
    </button>
  );
}
