import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/admin/PageHeader";
import { CreateTipModal, type TipFormData } from "../../components/admin/CreateTipModal";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { mockTips } from "../../data/mockData";
import type { FirstAidTip } from "../../types/admin";

export function FirstAidTipsPage() {
  const [tips, setTips] = useState<FirstAidTip[]>(mockTips);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<FirstAidTip | null>(null);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return tips;
    return tips.filter(
      (tip) =>
        tip.title.toLowerCase().includes(query) ||
        tip.author.toLowerCase().includes(query) ||
        tip.category.toLowerCase().includes(query),
    );
  }, [tips, search]);

  function handleCreate(data: TipFormData) {
    if (editingTip) {
      setTips((prev) =>
        prev.map((tip) =>
          tip.id === editingTip.id
            ? {
                ...tip,
                ...data,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : tip,
        ),
      );
      toast.success("Tip updated successfully");
    } else {
      const newTip: FirstAidTip = {
        id: String(Date.now()),
        author: "Dr. Kevin U.",
        updatedAt: new Date().toISOString().slice(0, 10),
        ...data,
      };
      setTips((prev) => [newTip, ...prev]);
      toast.success("Tip created successfully");
    }
    setEditingTip(null);
  }

  function handleDelete(id: string) {
    setTips((prev) => prev.filter((tip) => tip.id !== id));
    toast.success("Tip deleted");
  }

  function openCreate() {
    setEditingTip(null);
    setModalOpen(true);
  }

  function openEdit(tip: FirstAidTip) {
    setEditingTip(tip);
    setModalOpen(true);
  }

  return (
    <div>
      <PageHeader
        section="Content"
        title="First Aid Tips"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New tip
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

      <DataTable
        columns={[
          { key: "tip", label: "Tip" },
          { key: "category", label: "Category" },
          { key: "severity", label: "Severity" },
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
            <td className="px-5 py-4 text-gray-500">{tip.updatedAt}</td>
            <td className="px-5 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(tip)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-brand"
                  aria-label={`Edit ${tip.title}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(tip.id)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${tip.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <CreateTipModal
        key={editingTip?.id ?? "new"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTip(null);
        }}
        onSubmit={handleCreate}
        initialData={editingTip}
      />
    </div>
  );
}
