import {useEffect, useMemo, useState} from "react";
import { useNavigate } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { getUsers } from "../../utils/db.js";
import { useAuth } from "../../utils/AuthContext.jsx";
import EmptyState from "../../utils/EmptyState.jsx";
import UserRow from "./components/UserRow.jsx";
import LoginIntro from "./components/LoginIntro.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] =   useState();

    useEffect(() => {
        const loadData = async () => {
            const users = await getUsers();
            setUsers(users.data);
        };

        loadData();
    }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""))
    );
  }, [query, users]);

  const handleSelect = (user) => {
    login(user);
    navigate("/exams", { replace: true });
  };

      // console.log('Users',users);
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col bg-wa-panel shadow-panel">
      <LoginIntro total={users?.length} />

      <div className="sticky top-0 z-10 border-b border-wa-border bg-white px-4 py-3">
        <label className="flex items-center gap-3 rounded-full bg-wa-bubble px-4 py-2">
          <FaMagnifyingGlass className="h-4 w-4 text-wa-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a demo user by name or number"
            className="w-full bg-transparent text-sm outline-none placeholder:text-wa-muted"
          />
        </label>
      </div>

      <div className="flex-1 bg-wa-bg bg-chat-pattern px-4 py-4">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
          {filtered?.length === 0 ? (
            <EmptyState title="No user found" description="Try a different name or clear the search." />
          ) : (
            filtered?.map((user) => <UserRow key={user._id} user={user} onSelect={handleSelect} />)
          )}
        </div>
      </div>
    </div>
  );
}
