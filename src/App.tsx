import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { OverviewPage } from "./pages/admin/OverviewPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { ReviewersPage } from "./pages/admin/ReviewersPage";
import { HospitalsPage } from "./pages/admin/HospitalsPage";
import { FirstAidTipsPage } from "./pages/admin/FirstAidTipsPage";
import { ReportsPage } from "./pages/admin/ReportsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="reviewers" element={<ReviewersPage />} />
        <Route path="hospitals" element={<HospitalsPage />} />
        <Route path="tips" element={<FirstAidTipsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}
