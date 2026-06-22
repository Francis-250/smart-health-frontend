import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";
import { UserCornerMenu } from "./UserCornerMenu";

export function TopBar() {
  const { toggle, isOpen } = useSidebar();
  const [search, setSearch] = useState("");

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={toggle}
        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        aria-label={isOpen ? "Hide sidebar" : "Show sidebar"}
        aria-expanded={isOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search users, tips, hospitals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div className="ml-auto flex items-center">
        <UserCornerMenu />
      </div>
    </header>
  );
}
