import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorageAdapter, STORAGE_KEYS } from '@/utils/storage';
import { getTodayString } from '@/utils/time';

export interface DailyStats {
  date: string;
  pomosCount: number;
  focusMinutes: number;
  todosDone: number;
}

/** 日付キー(YYYY-MM-DD)→その日のデータ（過去最大30日分） */
export type StatsHistory = Record<string, Omit<DailyStats, 'date'>>;

interface StreakData {
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD。未記録時は空文字
}

interface StatsState {
  today: DailyStats;
  streak: StreakData;
  history: StatsHistory;
  recordPomo: (focusMinutes: number) => void;
  recordTodoDone: () => void;
  checkAndResetDaily: () => void;
}

const HISTORY_MAX_DAYS = 30;

function makeEmptyToday(): DailyStats {
  return { date: getTodayString(), pomosCount: 0, focusMinutes: 0, todosDone: 0 };
}

/**
 * 前回アクティブ日から連続日数を再計算する。
 * @precondition todayStr は YYYY-MM-DD 形式
 */
function calcNewStreak(streak: StreakData, todayStr: string): StreakData {
  if (streak.lastActiveDate === todayStr) return streak;
  if (!streak.lastActiveDate) return { currentStreak: 1, lastActiveDate: todayStr };

  const prev = new Date(streak.lastActiveDate);
  const today = new Date(todayStr);
  const diffDays = Math.round((today.getTime() - prev.getTime()) / 86_400_000);

  if (diffDays === 1) {
    return { currentStreak: streak.currentStreak + 1, lastActiveDate: todayStr };
  }
  return { currentStreak: 1, lastActiveDate: todayStr };
}

/** 30日以前のデータを履歴から削除する */
function pruneHistory(history: StatsHistory, todayStr: string): StatsHistory {
  const cutoff = new Date(todayStr);
  cutoff.setDate(cutoff.getDate() - HISTORY_MAX_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return Object.fromEntries(
    Object.entries(history).filter(([key]) => key > cutoffStr)
  );
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      today: makeEmptyToday(),
      streak: { currentStreak: 0, lastActiveDate: '' },
      history: {},

      /**
       * @precondition focusMinutes > 0
       * @postcondition today.pomosCount++、today.focusMinutes += focusMinutes、streak更新
       */
      recordPomo: (focusMinutes) => {
        const todayStr = getTodayString();
        set((state) => {
          const today =
            state.today.date === todayStr ? state.today : makeEmptyToday();
          return {
            today: {
              ...today,
              pomosCount: today.pomosCount + 1,
              focusMinutes: today.focusMinutes + focusMinutes,
            },
            streak: calcNewStreak(state.streak, todayStr),
          };
        });
      },

      /** @postcondition today.todosDone++、streak更新 */
      recordTodoDone: () => {
        const todayStr = getTodayString();
        set((state) => {
          const today =
            state.today.date === todayStr ? state.today : makeEmptyToday();
          return {
            today: { ...today, todosDone: today.todosDone + 1 },
            streak: calcNewStreak(state.streak, todayStr),
          };
        });
      },

      /**
       * 日付が変わっていたら今日のデータを履歴へ移して新しい today を作る。
       * onRehydrateStorage と起動時に呼ぶ。
       */
      checkAndResetDaily: () => {
        const todayStr = getTodayString();
        const { today, history } = get();
        if (today.date === todayStr) return;

        const { date, ...statsData } = today;
        const updated = pruneHistory({ ...history, [date]: statsData }, todayStr);
        set({ today: makeEmptyToday(), history: updated });
      },
    }),
    {
      name: STORAGE_KEYS.STATS,
      storage: createJSONStorage(() => asyncStorageAdapter),
      onRehydrateStorage: () => (state) => {
        state?.checkAndResetDaily();
      },
    }
  )
);
