import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionUser {
  name: string;
  email: string;
  initials: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: SessionUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<Pick<SessionUser, "name" | "initials">>) => void;
}

const ADMIN_ACCOUNTS = [
  {
    email: "vecuzoqe@mailinator.com",
    password: "Pa$$w0rd!",
    name: "Kevin Uwimana",
    initials: "KU",
  },
  {
    email: "admin@firstaid.com",
    password: "admin123",
    name: "Kevin Uwimana",
    initials: "KU",
  },
] as const;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email, password) => {
        const account = ADMIN_ACCOUNTS.find(
          (entry) => entry.email === email.trim() && entry.password === password,
        );

        if (account) {
          set({
            isAuthenticated: true,
            user: {
              name: account.name,
              email: account.email,
              initials: account.initials,
            },
          });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, user: null }),
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    { name: "admin-auth" },
  ),
);
