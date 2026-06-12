import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorageAdapter, STORAGE_KEYS } from '@/utils/storage';

export type CatColor = 'tabby' | 'black' | 'calico';

export interface Settings {
  catName: string;
  catColor: CatColor;
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  notificationEnabled: boolean;
  hasOnboarded: boolean;
}

interface SettingsState extends Settings {
  /** AsyncStorageからの読み込みが完了したかどうか */
  _hasHydrated: boolean;
  update: (partial: Partial<Settings>) => void;
  _setHasHydrated: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      catName: 'むぎ',
      catColor: 'tabby' as CatColor,
      focusMinutes: 25,
      breakMinutes: 5,
      longBreakMinutes: 15,
      notificationEnabled: true,
      hasOnboarded: false,
      _hasHydrated: false,
      update: (partial) => set((state) => ({ ...state, ...partial })),
      _setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => asyncStorageAdapter),
      // _hasHydrated は永続化対象外
      partialize: (state) => ({
        catName: state.catName,
        catColor: state.catColor,
        focusMinutes: state.focusMinutes,
        breakMinutes: state.breakMinutes,
        longBreakMinutes: state.longBreakMinutes,
        notificationEnabled: state.notificationEnabled,
        hasOnboarded: state.hasOnboarded,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    }
  )
);
