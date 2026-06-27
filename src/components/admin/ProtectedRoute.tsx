import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export function ProtectedRoute() {
  const { hydrated, isAuthenticated } = useAuthStore();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Checking administrator session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
