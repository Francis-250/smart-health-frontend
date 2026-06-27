import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { DataTable } from "../../components/ui/DataTable";
import { getApiError } from "../../lib/api";
import { getUsers } from "../../lib/adminApi";

export function UsersPage() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getUsers,
  });
  const users = data?.rows ?? [];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      [user.name, user.email, user.role, user.status]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search, users]);

  return (
    <div>
      <PageHeader section="Management" title="Users" />

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search users..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <p className="text-sm text-gray-500">
          {filtered.length} of {users.length} users
        </p>
      </div>

      {isLoading ? (
        <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
          Loading users…
        </p>
      ) : error ? (
        <p className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          {getApiError(error)}
        </p>
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "User" },
            { key: "role", label: "Role" },
            { key: "status", label: "Status" },
            { key: "joined", label: "Joined" },
          ]}
        >
          {filtered.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-5 py-4">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </td>
              <td className="px-5 py-4 text-gray-600">{user.role}</td>
              <td className="px-5 py-4">
                <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  {user.status}
                </span>
              </td>
              <td className="px-5 py-4 text-gray-500">{user.joinedAt}</td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
