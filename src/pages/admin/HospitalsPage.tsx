import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/admin/PageHeader";
import { CreateHospitalModal, type HospitalFormData } from "../../components/admin/CreateHospitalModal";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { mockHospitals } from "../../data/mockData";
import type { Hospital } from "../../types/admin";

export function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return hospitals;
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(query) ||
        h.location.toLowerCase().includes(query) ||
        h.contact.toLowerCase().includes(query),
    );
  }, [hospitals, search]);

  function handleAdd(data: HospitalFormData) {
    const newHospital: Hospital = {
      id: String(Date.now()),
      ...data,
    };
    setHospitals((prev) => [newHospital, ...prev]);
    toast.success("Hospital added successfully");
  }

  return (
    <div>
      <PageHeader
        section="Management"
        title="Hospitals"
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add hospital
          </Button>
        }
      />

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search hospitals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <p className="text-sm text-gray-500">
          {filtered.length} of {hospitals.length} hospitals
        </p>
      </div>

      <DataTable
        columns={[
          { key: "name", label: "Hospital" },
          { key: "location", label: "Location" },
          { key: "contact", label: "Contact" },
          { key: "status", label: "Status" },
        ]}
      >
        {filtered.map((hospital) => (
          <tr key={hospital.id} className="hover:bg-gray-50">
            <td className="px-5 py-4 font-medium text-gray-900">{hospital.name}</td>
            <td className="px-5 py-4 text-gray-600">{hospital.location}</td>
            <td className="px-5 py-4 text-gray-600">{hospital.contact}</td>
            <td className="px-5 py-4">
              <span
                className={[
                  "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                  hospital.status === "Active"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600",
                ].join(" ")}
              >
                {hospital.status}
              </span>
            </td>
          </tr>
        ))}
      </DataTable>

      <CreateHospitalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
      />
    </div>
  );
}
