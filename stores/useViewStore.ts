
import { create } from 'zustand';

type ViewType = 'grid' | 'list' | 'detail' | 'verticalGrid' | 'squareGrid';

interface ViewStore {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export const useViewStore = create<ViewStore>((set) => ({
  currentView: 'grid',
  setView: (view) => set({ currentView: view }),
}));