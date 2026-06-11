import { create } from 'zustand';
import { api } from '../api/client';
import { logout as authLogout } from '../api/client';

interface User {
  id: number;
  name: string;
  email: string;
  joinDate: string;
}

interface UserSettings {
  dailyReminder: boolean;
  darkMode: boolean;
  emailUpdates: boolean;
  notifications: boolean;
}

interface UserState {
  user: User | null;
  settings: UserSettings;
  login: (user: User) => void;
  logout: () => void;
  initFromStorage: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  settings: {
    dailyReminder: true,
    darkMode: true,
    emailUpdates: false,
    notifications: true,
  },

  initFromStorage: () => {
    const stored = api.getStoredUser();
    if (stored) {
      set({
        user: {
          id: stored.id,
          name: stored.username,
          email: stored.email || '',
          joinDate: new Date().toISOString().split('T')[0],
        },
      });
    }
    const savedSettings = localStorage.getItem('cisp_user_settings');
    if (savedSettings) {
      try {
        set({ settings: { ...get().settings, ...JSON.parse(savedSettings) } });
      } catch {}
    }
  },

  login: (user) => set({ user }),

  logout: () => {
    authLogout();
    set({ user: null });
  },

  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    set({ settings: updated });
    localStorage.setItem('cisp_user_settings', JSON.stringify(updated));
  },
}));
