import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { DataTable } from "../../components/ui/DataTable";
import { mockTips } from "../../data/mockData";

export function FirstAidTipsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return mockTips;
    return mockTips.filter(
      (tip) =>
        tip.title.toLowerCase().includes(query) ||
        tip.author.toLowerCase().includes(query) ||
        tip.category.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div>
      <PageHeader section="Content" title="First Aid Tips" />

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search tips..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <p className="text-sm text-gray-500">
          {filtered.length} of {mockTips.length} tips
        </p>
      </div>

      <DataTable
        columns={[
          { key: "tip", label: "Tip" },
          { key: "category", label: "Category" },
          { key: "severity", label: "Severity" },
          { key: "updated", label: "Updated" },
        ]}
      >
        {filtered.map((tip) => (
          <tr key={tip.id} className="hover:bg-gray-50">
            <td className="px-5 py-4">
              <p className="font-medium text-gray-900">{tip.title}</p>
              <p className="text-xs text-gray-500">by {tip.author}</p>
            </td>
            <td className="px-5 py-4 text-gray-600">{tip.category}</td>
            <td className="px-5 py-4">
              <span
                className={[
                  "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                  tip.severity === "Critical"
                    ? "bg-red-50 text-red-700"
                    : tip.severity === "High"
                      ? "bg-orange-50 text-orange-700"
                      : tip.severity === "Medium"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-green-50 text-green-700",
                ].join(" ")}
              >
                {tip.severity}
              </span>
            </td>
            <td className="px-5 py-4 text-gray-500">{tip.updatedAt}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
