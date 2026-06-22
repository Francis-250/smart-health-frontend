import { Plus, Search } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { mockUsers } from "../../data/mockData";

export function UsersPage() {
  return (
    <div>
      <PageHeader
        section="Management"
        title="Users"
        action={
          <Button>
            <Plus className="h-4 w-4" />
            New user
          </Button>
        }
      />

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search users..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <p className="text-sm text-gray-500">{mockUsers.length} of {mockUsers.length} users</p>
      </div>

      <DataTable
        columns={[
          { key: "name", label: "User" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
          { key: "joined", label: "Joined" },
        ]}
      >
        {mockUsers.map((user) => (
          <tr key={user.id} className="hover:bg-gray-50">
            <td className="px-5 py-4">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </td>
            <td className="px-5 py-4 text-gray-600">{user.role}</td>
            <td className="px-5 py-4">
              <span
                className={[
                  "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                  user.status === "Active"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700",
                ].join(" ")}
              >
                {user.status}
              </span>
            </td>
            <td className="px-5 py-4 text-gray-500">{user.joinedAt}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
