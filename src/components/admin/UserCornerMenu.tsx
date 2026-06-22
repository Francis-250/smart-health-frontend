import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export function UserCornerMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToProfile() {
    setOpen(false);
    navigate("/admin/profile");
  }

  function handleLogout() {
    setOpen(false);
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        type="button"
        className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      </button>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-2.5 shadow-sm transition-colors hover:border-brand/30 hover:bg-brand-light/30"
          aria-expanded={open}
          aria-label="Account menu"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
            {user?.initials ?? "KU"}
          </span>
          <ChevronDown
            className={[
              "h-4 w-4 text-gray-500 transition-transform",
              open ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">{user?.name ?? "Admin"}</p>
              <p className="truncate text-xs text-gray-500">{user?.email ?? ""}</p>
            </div>
            <div className="py-1">
              <button
                type="button"
                onClick={goToProfile}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <User className="h-4 w-4 text-gray-400" />
                Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
