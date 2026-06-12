import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorageAdapter, STORAGE_KEYS } from '@/utils/storage';
import { getTodayString } from '@/utils/time';
import { useStatsStore } from '@/stores/statsStore';

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
  doneAt?: number;
}

interface TodoState {
  todos: Todo[];
  lastResetDate: string;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  resetDoneTodos: () => void;
  setTodos: (todos: Todo[]) => void;
  checkAndResetDaily: () => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      lastResetDate: getTodayString(),
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: generateId(), text, done: false, createdAt: Date.now() },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => {
          const target = state.todos.find((t) => t.id === id);
          // done: false → true のときだけ記録（取り消しはカウントしない）
          if (target && !target.done) {
            useStatsStore.getState().recordTodoDone();
          }
          return {
            todos: state.todos.map((todo) =>
              todo.id === id
                ? { ...todo, done: !todo.done, doneAt: todo.done ? undefined : Date.now() }
                : todo
            ),
          };
        }),
      deleteTodo: (id) =>
        set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),
      resetDoneTodos: () =>
        set((state) => ({ todos: state.todos.filter((t) => !t.done) })),
      setTodos: (todos) => set({ todos }),
      checkAndResetDaily: () => {
        const today = getTodayString();
        if (get().lastResetDate === today) return;
        set((state) => ({
          todos: state.todos.filter((t) => !t.done),
          lastResetDate: today,
        }));
      },
    }),
    {
      name: STORAGE_KEYS.TODOS,
      storage: createJSONStorage(() => asyncStorageAdapter),
      onRehydrateStorage: () => (state) => {
        state?.checkAndResetDaily();
      },
    }
  )
);
