import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import Avatar from "./Avatar.jsx";
import { useAuth } from "./AuthContext.jsx";

export default function ChatHeader({
  title,
  subtitle,
  backTo,
  showBack = true,
  showLogout = true,
  avatarSrc = "/images/logo.svg",
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="wa-header">
      {showBack && (
        <button
          type="button"
          aria-label="Go back"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          className="rounded-full p-2 transition hover:bg-white/10"
        >
          <FaArrowLeft className="h-4 w-4" />
        </button>
      )}
      <Avatar name={title} src={avatarSrc} size={40} />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="truncate text-xs text-white/70">{subtitle}</p>}
      </div>
      {showLogout && user && (
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition hover:bg-white/10"
        >
          <FiLogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      )}
    </header>
  );
}
