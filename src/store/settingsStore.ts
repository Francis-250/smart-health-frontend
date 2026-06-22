import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AILimits {
  dailyQueryLimit: number;
  perUserDailyLimit: number;
  monthlyBudgetUsd: number;
}

interface SettingsState {
  aiLimits: AILimits;
  updateAILimits: (limits: Partial<AILimits>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      aiLimits: {
        dailyQueryLimit: 500,
        perUserDailyLimit: 20,
        monthlyBudgetUsd: 150,
      },
      updateAILimits: (limits) =>
        set((state) => ({
          aiLimits: { ...state.aiLimits, ...limits },
        })),
    }),
    { name: "admin-settings" },
  ),
);
