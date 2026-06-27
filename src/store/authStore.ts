import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, getApiError, TOKEN_KEY } from "../lib/api";

export type BackendRole = "PATIENT" | "REVIEWER" | "ADMIN";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: BackendRole;
}

type BackendUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: BackendRole;
};

interface AuthState {
  error: string | null;
  hydrated: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
  user: SessionUser | null;
  clearError: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  updateProfile: (data: Partial<Pick<SessionUser, "name" | "initials">>) => void;
}

function toSessionUser(user: BackendUser): SessionUser {
  const name = `${user.firstName} ${user.lastName}`.trim() || user.email;
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: user.id,
    email: user.email,
    initials: initials || "AD",
    name,
    role: user.role,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      error: null,
      hydrated: false,
      isAuthenticated: false,
      loading: false,
      token: null,
      user: null,
      clearError: () => set({ error: null }),
      login: async (email, password) => {
        set({ error: null, loading: true });
        try {
          const { data } = await api.post<{ token: string; user: BackendUser }>(
            "/auth/login",
            { email, password },
          );

          if (data.user.role !== "ADMIN") {
            set({
              error: "This dashboard is restricted to administrator accounts.",
              isAuthenticated: false,
              loading: false,
              token: null,
              user: null,
            });
            localStorage.removeItem(TOKEN_KEY);
            return false;
          }

          localStorage.setItem(TOKEN_KEY, data.token);
          set({
            error: null,
            isAuthenticated: true,
            loading: false,
            token: data.token,
            user: toSessionUser(data.user),
          });
          return true;
        } catch (error) {
          set({
            error: getApiError(error),
            isAuthenticated: false,
            loading: false,
            token: null,
            user: null,
          });
          localStorage.removeItem(TOKEN_KEY);
          return false;
        }
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        set({ error: null, isAuthenticated: false, token: null, user: null });
      },
      refreshSession: async () => {
        const token = get().token ?? localStorage.getItem(TOKEN_KEY);
        if (!token) {
          set({ hydrated: true, isAuthenticated: false, user: null });
          return;
        }
        localStorage.setItem(TOKEN_KEY, token);
        try {
          const { data } = await api.get<BackendUser>("/auth/me");
          if (data.role !== "ADMIN") {
            get().logout();
            set({ hydrated: true });
            return;
          }
          set({
            error: null,
            hydrated: true,
            isAuthenticated: true,
            token,
            user: toSessionUser(data),
          });
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          set({
            hydrated: true,
            isAuthenticated: false,
            token: null,
            user: null,
          });
        }
      },
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "admin-auth",
      onRehydrateStorage: () => (state) => {
        state?.refreshSession();
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
