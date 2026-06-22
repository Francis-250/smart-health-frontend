import { Plus, Search } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { mockHospitals } from "../../data/mockData";

export function HospitalsPage() {
  return (
    <div>
      <PageHeader
        section="Management"
        title="Hospitals"
        action={
          <Button>
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
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <p className="text-sm text-gray-500">
          {mockHospitals.length} of {mockHospitals.length} hospitals
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
        {mockHospitals.map((hospital) => (
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
    </div>
  );
}
