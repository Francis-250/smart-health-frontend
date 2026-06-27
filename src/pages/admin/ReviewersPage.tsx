import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { DataTable } from "../../components/ui/DataTable";
import { getReviewers } from "../../lib/adminApi";
import { getApiError } from "../../lib/api";

export function ReviewersPage() {
  const [search, setSearch] = useState("");
  const { data = [], error, isLoading } = useQuery({
    queryKey: ["admin-reviewers"],
    queryFn: getReviewers,
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter((reviewer) =>
      [reviewer.name, reviewer.email, reviewer.specialty, reviewer.status]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [data, search]);

  return (
    <div>
      <PageHeader section="Management" title="Reviewers" />

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search reviewers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <p className="text-sm text-gray-500">
          {filtered.length} of {data.length} reviewers
        </p>
      </div>

      {isLoading ? (
        <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
          Loading reviewers…
        </p>
      ) : error ? (
        <p className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          {getApiError(error)}
        </p>
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Reviewer" },
            { key: "specialty", label: "Specialty" },
            { key: "reviewed", label: "Tips reviewed" },
            { key: "status", label: "Status" },
          ]}
        >
          {filtered.map((reviewer) => (
            <tr key={reviewer.id} className="hover:bg-gray-50">
              <td className="px-5 py-4">
                <p className="font-medium text-gray-900">{reviewer.name}</p>
                <p className="text-xs text-gray-500">{reviewer.email}</p>
              </td>
              <td className="px-5 py-4 text-gray-600">{reviewer.specialty}</td>
              <td className="px-5 py-4 text-gray-600">{reviewer.tipsReviewed}</td>
              <td className="px-5 py-4">
                <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  {reviewer.status}
                </span>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
