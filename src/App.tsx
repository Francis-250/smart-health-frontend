import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { AdminLayout } from "./layouts/AdminLayout";
import { LoginPage } from "./pages/admin/LoginPage";
import { OverviewPage } from "./pages/admin/OverviewPage";
import { AnalyticsPage } from "./pages/admin/AnalyticsPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { ReviewersPage } from "./pages/admin/ReviewersPage";
import { HospitalsPage } from "./pages/admin/HospitalsPage";
import { FirstAidTipsPage } from "./pages/admin/FirstAidTipsPage";
import { ReportsPage } from "./pages/admin/ReportsPage";
import { ProfilePage } from "./pages/admin/ProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="reviewers" element={<ReviewersPage />} />
          <Route path="hospitals" element={<HospitalsPage />} />
          <Route path="tips" element={<FirstAidTipsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}
