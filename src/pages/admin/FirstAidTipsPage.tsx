import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/admin/PageHeader";
import { CreateTipModal, type TipFormData } from "../../components/admin/CreateTipModal";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { createFirstAidTip, getFirstAidTips } from "../../lib/adminApi";
import { getApiError } from "../../lib/api";
import type { SeverityLevel } from "../../types/admin";

const severityToRisk: Record<SeverityLevel, "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY"> = {
  Critical: "EMERGENCY",
  High: "HIGH",
  Low: "LOW",
  Medium: "MEDIUM",
};

function lines(value: string) {
  return value
    .split(/\n+/)
    .map((line) => line.replace(/^\d+[.)]\s*/, "").trim())
    .filter(Boolean);
}

export function FirstAidTipsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { data: tips = [], error, isLoading } = useQuery({
    queryKey: ["admin-first-aid-tips"],
    queryFn: () => getFirstAidTips(),
  });
  const createMutation = useMutation({
    mutationFn: (data: TipFormData) =>
      createFirstAidTip({
        category: data.category,
        description: data.description.trim(),
        emergencyLevel: severityToRisk[data.severity],
        isOfflineReady: true,
        steps: lines(data.procedure || data.description),
        title: data.title.trim(),
        warnings: lines(data.warnings),
      }),
    onSuccess: () => {
      toast.success("First-aid tip created");
      queryClient.invalidateQueries({ queryKey: ["admin-first-aid-tips"] });
    },
    onError: (requestError) => toast.error(getApiError(requestError)),
  });

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return tips;
    return tips.filter(
      (tip) =>
        tip.title.toLowerCase().includes(query) ||
        tip.author.toLowerCase().includes(query) ||
        tip.category.toLowerCase().includes(query),
    );
  }, [search, tips]);

  return (
    <div>
      <PageHeader
        section="Content"
        title="First Aid Tips"
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create tip
          </Button>
        }
      />

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
          {filtered.length} of {tips.length} tips
        </p>
      </div>

      {isLoading ? (
        <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
          Loading first-aid tips…
        </p>
      ) : error ? (
        <p className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          {getApiError(error)}
        </p>
      ) : (
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
      )}

      <CreateTipModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => createMutation.mutate(data)}
      />
    </div>
  );
}
