import { Users, BookOpen, Building2, UserCheck } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { mockHospitals, mockReviewers, mockTips, mockUsers } from "../../data/mockData";

const stats = [
  {
    label: "Total Users",
    value: mockUsers.length,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "First Aid Tips",
    value: mockTips.length,
    icon: BookOpen,
    color: "bg-brand-light text-brand",
  },
  {
    label: "Hospitals",
    value: mockHospitals.length,
    icon: Building2,
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "Reviewers",
    value: mockReviewers.length,
    icon: UserCheck,
    color: "bg-amber-50 text-amber-600",
  },
];

export function OverviewPage() {
  return (
    <div>
      <PageHeader section="Dashboard" title="Overview" />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
              </div>
              <div className={`rounded-lg p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Recent activity</h2>
          <ul className="mt-4 space-y-3">
            <li className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Dr. Sarah Mwangi</span> reviewed
              &ldquo;Treating Minor Burns&rdquo;
            </li>
            <li className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Grace Njoroge</span> registered as a
              new patient
            </li>
            <li className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Kigali Central Hospital</span> was
              added to the network
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Add new tip", "Invite reviewer", "Register hospital", "Export report"].map(
              (action) => (
                <button
                  key={action}
                  type="button"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-brand hover:text-brand"
                >
                  {action}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
