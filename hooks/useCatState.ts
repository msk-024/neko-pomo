import { useMemo } from 'react';
import { useTimerStore } from '@/stores/timerStore';
import { useTodoStore } from '@/stores/todoStore';
import { getCurrentHour } from '@/utils/time';
import type { CatState } from '@/constants/cats';

/**
 * @postcondition SPEC.mdの優先順位に従ったCatStateを返す
 */
export function useCatState(): CatState {
  const { isRunning, mode } = useTimerStore();
  const todos = useTodoStore((s) => s.todos);

  return useMemo((): CatState => {
    const hour = getCurrentHour();
    if (hour >= 23 || hour < 6) return 'sleep';
    if (isRunning && mode === 'focus') return 'focusing';
    if (isRunning && (mode === 'break' || mode === 'longBreak')) return 'break';
    const allDone = todos.length > 0 && todos.every((t) => t.done);
    if (allDone) return 'happy';
    if (todos.some((t) => !t.done)) return 'stare';
    return 'idle';
  }, [isRunning, mode, todos]);
}
