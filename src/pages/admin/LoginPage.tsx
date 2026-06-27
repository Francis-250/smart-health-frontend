import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Activity, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const { error, hydrated, isAuthenticated, login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (hydrated && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const success = await login(email.trim(), password);
    setLoading(false);

    if (success) {
      toast.success("Signed in to Smart Health Admin");
      navigate("/admin");
    } else {
      toast.error(useAuthStore.getState().error ?? "Unable to sign in");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-brand p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">Smart Health</p>
            <p className="text-sm text-white/70">Admin Console</p>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold leading-tight">
            Manage the clinical safety layer with confidence.
          </h1>
          <p className="mt-4 max-w-md text-white/80">
            Review platform activity, care locations, first-aid content, and administrator reports.
          </p>
        </div>

        <p className="text-sm text-white/50">Smart Health administrator access only</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Smart Health</p>
                <p className="text-xs text-gray-500">Admin Console</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900">Admin sign in</h2>
          <p className="mt-2 text-sm text-gray-500">
            Use an administrator account. Patient and reviewer accounts stay on mobile.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full py-2.5"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 rounded-lg bg-brand-light px-4 py-3 text-xs text-brand">
            Administrator access is restricted to approved Smart Health staff.
          </p>
        </div>
      </div>
    </div>
  );
}
