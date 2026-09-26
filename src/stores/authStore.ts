import { create } from 'zustand';
import type { UserProfile, UserSettings } from '../types';
import { loadFromStorage, saveToStorage } from '../services/storage';
import { DEFAULT_BALANCE, DEFAULT_BROKERAGE } from '../utils/constants';
import { generateId } from '../utils/formatters';

interface AuthState {
  user: UserProfile | null;
  isOnboarded: boolean;
  login: (username: string) => void;
  logout: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addXP: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
}

const defaultSettings: UserSettings = {
  defaultBalance: DEFAULT_BALANCE,
  simulationMode: 'beginner',
  darkMode: true,
  brokerageModel: DEFAULT_BROKERAGE,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: loadFromStorage<UserProfile | null>('user', null),
  isOnboarded: loadFromStorage<boolean>('onboarded', false),

  login: (username: string) => {
    const user: UserProfile = {
      id: generateId(),
      username,
      email: '',
      createdAt: new Date().toISOString(),
      settings: defaultSettings,
      xp: 0,
      level: 1,
      achievements: [],
    };
    saveToStorage('user', user);
    saveToStorage('onboarded', true);
    set({ user, isOnboarded: true });
  },

  logout: () => {
    saveToStorage('user', null);
    set({ user: null });
  },

  updateSettings: (updates: Partial<UserSettings>) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, settings: { ...user.settings, ...updates } };
    saveToStorage('user', updated);
    set({ user: updated });
  },

  addXP: (amount: number) => {
    const { user } = get();
    if (!user) return;
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    const updated = { ...user, xp: newXP, level: newLevel };
    saveToStorage('user', updated);
    set({ user: updated });
  },

  unlockAchievement: (achievementId: string) => {
    const { user } = get();
    if (!user || user.achievements.includes(achievementId)) return;
    const updated = { ...user, achievements: [...user.achievements, achievementId] };
    saveToStorage('user', updated);
    set({ user: updated });
  },
}));
