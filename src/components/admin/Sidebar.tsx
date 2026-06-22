import { NavLink } from "react-router-dom";
import {
  Activity,
  BookOpen,
  Building2,
  FileText,
  LayoutGrid,
  UserCheck,
  Users,
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/reviewers", label: "Reviewers", icon: UserCheck },
  { to: "/admin/hospitals", label: "Hospitals", icon: Building2 },
  { to: "/admin/tips", label: "First Aid Tips", icon: BookOpen },
  { to: "/admin/reports", label: "Reports", icon: FileText },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-gray-200 bg-[#f9fafb]">
      <div className="border-b border-gray-200 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">First Aid Assistant</p>
            <p className="text-xs text-gray-500">Admin Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-light text-brand"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
                )}
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 px-5 py-4">
        <p className="text-xs text-gray-500">Signed in as</p>
        <p className="text-sm font-medium text-gray-800">Admin · Kevin U.</p>
      </div>
    </aside>
  );
}
