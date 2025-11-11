import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsData {
  minimizeOnLaunch: boolean;
}

interface AuthState {
  user: SettingsData | null;
  login: (data: SettingsData) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (data) => set({ user: data }),
      logout: () => set({ user: null }),
    }),
    {
      name: "persist:auth",
    }
  )
);
