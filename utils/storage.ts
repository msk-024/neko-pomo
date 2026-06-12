import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  TODOS:    'neko-pomo:todos',
  STATS:    'neko-pomo:stats',
  SETTINGS: 'neko-pomo:settings',
  CAT:      'neko-pomo:cat',
  TIMER:    'neko-pomo:timer',
  STREAK:   'neko-pomo:streak',
} as const;

export async function saveData<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadData<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;
  return JSON.parse(raw) as T;
}

export async function removeData(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

// Zustand persist middleware 用アダプター
export const asyncStorageAdapter = {
  getItem: (name: string) => AsyncStorage.getItem(name),
  setItem: (name: string, value: string) => AsyncStorage.setItem(name, value),
  removeItem: (name: string) => AsyncStorage.removeItem(name),
};
