import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/admin/PageHeader";
import { DataTable } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";
import { deactivateUser, getReviewers, updateUserRole } from "../../lib/adminApi";
import { getApiError } from "../../lib/api";
import type { Reviewer } from "../../types/admin";

export function ReviewersPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Reviewer | null>(null);
  const [nextRole, setNextRole] = useState<"PATIENT" | "REVIEWER" | "ADMIN">("REVIEWER");
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Reviewer | null>(null);
  const { data = [], error, isLoading } = useQuery({
    queryKey: ["admin-reviewers"],
    queryFn: getReviewers,
  });
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: "PATIENT" | "REVIEWER" | "ADMIN" }) =>
      updateUserRole(id, role),
    onSuccess: () => {
      toast.success("Reviewer account updated");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-reviewers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (requestError) => toast.error(getApiError(requestError)),
  });
  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      toast.success("Reviewer deactivated");
      queryClient.invalidateQueries({ queryKey: ["admin-reviewers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (requestError) => toast.error(getApiError(requestError)),
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
            { key: "actions", label: "Actions", className: "text-right" },
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
              <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-brand"
                    onClick={() => setViewing(reviewer)}
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-brand"
                    onClick={() => {
                      setEditing(reviewer);
                      setNextRole("REVIEWER");
                    }}
                    type="button"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm(`Deactivate ${reviewer.name}?`)) {
                        deactivateMutation.mutate(reviewer.id);
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
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing?.name ?? "Reviewer"}
        subtitle="Reviewer account details"
      >
        {viewing && (
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-gray-500">Name</dt><dd className="font-medium text-gray-900">{viewing.name}</dd></div>
            <div><dt className="text-gray-500">Email</dt><dd className="font-medium text-gray-900">{viewing.email}</dd></div>
            <div><dt className="text-gray-500">Specialty</dt><dd className="font-medium text-gray-900">{viewing.specialty}</dd></div>
            <div><dt className="text-gray-500">Status</dt><dd className="font-medium text-gray-900">{viewing.status}</dd></div>
          </dl>
        )}
      </Modal>
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing ? `Update ${editing.name}` : "Update reviewer"}
        subtitle="Change this account role or keep it as a reviewer."
        footer={
          <>
            <button
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setEditing(null)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
              onClick={() => {
                if (editing) updateRoleMutation.mutate({ id: editing.id, role: nextRole });
              }}
              type="button"
            >
              Save role
            </button>
          </>
        }
      >
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
        <select
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          onChange={(event) => setNextRole(event.target.value as "PATIENT" | "REVIEWER" | "ADMIN")}
          value={nextRole}
        >
          <option value="REVIEWER">Reviewer</option>
          <option value="PATIENT">Patient</option>
          <option value="ADMIN">Admin</option>
        </select>
      </Modal>
    </div>
  );
}
