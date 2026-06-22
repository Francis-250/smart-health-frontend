import { useEffect, useState } from "react";
import { Mail, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/admin/PageHeader";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-shadow placeholder:text-gray-400 focus:border-brand focus:ring-4 focus:ring-brand/10";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name ?? "");

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user?.name]);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Username cannot be empty");
      return;
    }
    updateProfile({ name: trimmed, initials: getInitials(trimmed) });
    toast.success("Profile updated successfully");
  }

  const hasChanges = name.trim() !== (user?.name ?? "");

  return (
    <div>
      <PageHeader section="Account" title="Admin Profile" />

      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative bg-gradient-to-br from-brand to-[#0d9488] px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-60" />
            <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-end">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white/30 bg-white/20 text-3xl font-bold text-white shadow-lg backdrop-blur-sm">
                {user?.initials ?? "KU"}
              </div>
              <div className="pb-1 text-center sm:text-left">
                <h2 className="text-xl font-semibold text-white">{user?.name ?? "Admin"}</h2>
                <p className="text-sm text-white/80">{user?.email ?? ""}</p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  <Shield className="h-3 w-3" />
                  System Administrator
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="text-base font-semibold text-gray-900">Admin details</h3>
            <p className="mt-1 text-sm text-gray-500">
              Update your display name. This appears in the sidebar and across the console.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 text-gray-400" />
                  Username
                </label>
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="h-4 w-4 text-gray-400" />
                  Email address
                </label>
                <input
                  className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`}
                  value={user?.email ?? ""}
                  readOnly
                />
                <p className="mt-1.5 text-xs text-gray-400">Email is managed by your organization.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Role</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">Administrator</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Account status</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Active
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-6">
                <Button onClick={handleSave} disabled={!hasChanges || !name.trim()}>
                  Save changes
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setName(user?.name ?? "")}
                  disabled={!hasChanges}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
