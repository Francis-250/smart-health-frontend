import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/admin/PageHeader";
import { CreateHospitalModal, type HospitalFormData } from "../../components/admin/CreateHospitalModal";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { createHospital, getHospitals } from "../../lib/adminApi";
import { getApiError } from "../../lib/api";

export function HospitalsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { data: hospitals = [], error, isLoading } = useQuery({
    queryKey: ["admin-hospitals"],
    queryFn: getHospitals,
  });
  const createMutation = useMutation({
    mutationFn: (data: HospitalFormData) =>
      createHospital({
        address: data.address.trim(),
        isEmergency: data.isEmergency,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        name: data.name.trim(),
        phoneNumber: data.phoneNumber.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Hospital added");
      queryClient.invalidateQueries({ queryKey: ["admin-hospitals"] });
    },
    onError: (requestError) => toast.error(getApiError(requestError)),
  });

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return hospitals;
    return hospitals.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(query) ||
        hospital.location.toLowerCase().includes(query) ||
        hospital.contact.toLowerCase().includes(query),
    );
  }, [hospitals, search]);

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

      {isLoading ? (
        <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
          Loading hospitals…
        </p>
      ) : error ? (
        <p className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          {getApiError(error)}
        </p>
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Hospital" },
            { key: "location", label: "Location" },
            { key: "contact", label: "Contact" },
            { key: "status", label: "Emergency" },
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
                  {hospital.status === "Active" ? "Available" : "Unavailable"}
                </span>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      <CreateHospitalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => createMutation.mutate(data)}
      />
    </div>
  );
}
