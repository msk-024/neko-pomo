import { create } from 'zustand';

export type CatColor = 'tabby' | 'black' | 'calico';

interface CatState {
  name: string;
  color: CatColor;
  setName: (name: string) => void;
  setColor: (color: CatColor) => void;
}

export const useCatStore = create<CatState>((set) => ({
  name: 'むぎ',
  color: 'tabby',
  setName: (name) => set({ name }),
  setColor: (color) => set({ color }),
}));
