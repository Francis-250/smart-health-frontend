import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/admin/PageHeader";
import { CreateHospitalModal, type HospitalFormData } from "../../components/admin/CreateHospitalModal";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";
import { createHospital, deleteHospital, getHospitals, updateHospital } from "../../lib/adminApi";
import { getApiError } from "../../lib/api";
import type { Hospital } from "../../types/admin";

export function HospitalsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Hospital | null>(null);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Hospital | null>(null);
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
  const updateMutation = useMutation({
    mutationFn: ({ data, id }: { data: HospitalFormData; id: string }) =>
      updateHospital(id, {
        address: data.address.trim(),
        isEmergency: data.isEmergency,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        name: data.name.trim(),
        phoneNumber: data.phoneNumber.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Hospital updated");
      queryClient.invalidateQueries({ queryKey: ["admin-hospitals"] });
    },
    onError: (requestError) => toast.error(getApiError(requestError)),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteHospital,
    onSuccess: () => {
      toast.success("Hospital deleted");
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
          <Button onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}>
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
            { key: "actions", label: "Actions", className: "text-right" },
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
              <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-brand"
                    onClick={() => setViewing(hospital)}
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-brand"
                    onClick={() => {
                      setEditing(hospital);
                      setModalOpen(true);
                    }}
                    type="button"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm(`Delete ${hospital.name}?`)) {
                        deleteMutation.mutate(hospital.id);
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

      <CreateHospitalModal
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
        title={viewing?.name ?? "Hospital"}
        subtitle="Hospital details"
      >
        {viewing && (
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-gray-500">Address</dt><dd className="font-medium text-gray-900">{viewing.address}</dd></div>
            <div><dt className="text-gray-500">Contact</dt><dd className="font-medium text-gray-900">{viewing.contact}</dd></div>
            <div><dt className="text-gray-500">Latitude</dt><dd className="font-medium text-gray-900">{viewing.latitude}</dd></div>
            <div><dt className="text-gray-500">Longitude</dt><dd className="font-medium text-gray-900">{viewing.longitude}</dd></div>
            <div><dt className="text-gray-500">Emergency</dt><dd className="font-medium text-gray-900">{viewing.isEmergency ? "Available" : "Unavailable"}</dd></div>
          </dl>
        )}
      </Modal>
    </div>
  );
}
