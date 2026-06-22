import { Search } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { DataTable } from "../../components/ui/DataTable";
import { mockReviewers } from "../../data/mockData";

export function ReviewersPage() {
  return (
    <div>
      <PageHeader section="Management" title="Reviewers" />

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search reviewers..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <p className="text-sm text-gray-500">
          {mockReviewers.length} of {mockReviewers.length} reviewers
        </p>
      </div>

      <DataTable
        columns={[
          { key: "name", label: "Reviewer" },
          { key: "specialty", label: "Specialty" },
          { key: "reviewed", label: "Tips reviewed" },
          { key: "status", label: "Status" },
        ]}
      >
        {mockReviewers.map((reviewer) => (
          <tr key={reviewer.id} className="hover:bg-gray-50">
            <td className="px-5 py-4">
              <p className="font-medium text-gray-900">{reviewer.name}</p>
              <p className="text-xs text-gray-500">{reviewer.email}</p>
            </td>
            <td className="px-5 py-4 text-gray-600">{reviewer.specialty}</td>
            <td className="px-5 py-4 text-gray-600">{reviewer.tipsReviewed}</td>
            <td className="px-5 py-4">
              <span
                className={[
                  "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                  reviewer.status === "Active"
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700",
                ].join(" ")}
              >
                {reviewer.status}
              </span>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
