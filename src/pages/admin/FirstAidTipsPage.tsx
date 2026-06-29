import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Edit, Eye, Plus, Search, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/admin/PageHeader";
import {
  CreateTipModal,
  type TipFormData,
} from "../../components/admin/CreateTipModal";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";
import {
  createFirstAidTip,
  deleteFirstAidTip,
  getFirstAidTips,
  updateFirstAidTip,
  updateFirstAidTipStatus,
} from "../../lib/adminApi";
import { getApiError } from "../../lib/api";
import type { FirstAidTip, SeverityLevel } from "../../types/admin";

const severityToRisk: Record<
  SeverityLevel,
  "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY"
> = {
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
  const [editing, setEditing] = useState<FirstAidTip | null>(null);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<FirstAidTip | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const {
    data: tips = [],
    error,
    isLoading,
  } = useQuery({
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
  const updateMutation = useMutation({
    mutationFn: ({ data, id }: { data: TipFormData; id: string }) =>
      updateFirstAidTip(id, {
        category: data.category,
        description: data.description.trim(),
        emergencyLevel: severityToRisk[data.severity],
        isOfflineReady: true,
        steps: lines(data.procedure || data.description),
        title: data.title.trim(),
        warnings: lines(data.warnings),
      }),
    onSuccess: () => {
      toast.success("First-aid tip updated");
      queryClient.invalidateQueries({ queryKey: ["admin-first-aid-tips"] });
    },
    onError: (requestError) => toast.error(getApiError(requestError)),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteFirstAidTip,
    onSuccess: () => {
      toast.success("First-aid tip deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-first-aid-tips"] });
    },
    onError: (requestError) => toast.error(getApiError(requestError)),
  });
  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
    }) => updateFirstAidTipStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === "APPROVED"
          ? "First-aid tip approved"
          : variables.status === "REJECTED"
            ? "First-aid tip rejected"
            : "First-aid tip moved to pending",
      );
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
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
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
            { key: "status", label: "Approval" },
            { key: "updated", label: "Updated" },
            { key: "actions", label: "Actions", className: "text-right" },
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
              <td className="px-5 py-4">
                <span
                  className={[
                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                    tip.approvalStatus === "Approved"
                      ? "bg-green-50 text-green-700"
                      : tip.approvalStatus === "Rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700",
                  ].join(" ")}
                >
                  {tip.approvalStatus}
                </span>
              </td>
              <td className="px-5 py-4 text-gray-500">{tip.updatedAt}</td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                  {tip.approvalStatus !== "Approved" && (
                    <button
                      className="rounded-lg border border-green-100 p-2 text-green-700 hover:bg-green-50"
                      onClick={() =>
                        statusMutation.mutate({
                          id: tip.id,
                          status: "APPROVED",
                        })
                      }
                      title="Approve"
                      type="button"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                  {tip.approvalStatus !== "Rejected" && (
                    <button
                      className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                      onClick={() =>
                        statusMutation.mutate({
                          id: tip.id,
                          status: "REJECTED",
                        })
                      }
                      title="Reject"
                      type="button"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-brand"
                    onClick={() => setViewing(tip)}
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-brand"
                    onClick={() => {
                      setEditing(tip);
                      setModalOpen(true);
                    }}
                    type="button"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm(`Delete ${tip.title}?`)) {
                        deleteMutation.mutate(tip.id);
                      }
                    }}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      <CreateTipModal
        initialData={editing}
        open={modalOpen}
        onClose={() => {
          setEditing(null);
          setModalOpen(false);
        }}
        onSubmit={(data) => {
          if (editing) updateMutation.mutate({ data, id: editing.id });
          else createMutation.mutate(data);
        }}
      />
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing?.title ?? "First-aid tip"}
        subtitle="Patient-facing first-aid content"
      >
        {viewing && (
          <div className="space-y-5 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Description
              </p>
              <p className="mt-1 text-gray-800">{viewing.description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Procedure
              </p>
              <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 font-sans text-gray-800">
                {viewing.procedure || "No steps recorded."}
              </pre>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Warnings
              </p>
              <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-red-50 p-3 font-sans text-red-800">
                {viewing.warnings || "No warnings recorded."}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
