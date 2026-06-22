import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../contexts/SidebarContext";
import { Sidebar } from "../components/admin/Sidebar";
import { TopBar } from "../components/admin/TopBar";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <Sidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
