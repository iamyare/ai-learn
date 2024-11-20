
import { create } from 'zustand'



interface NotebookStore {
  notebookInfo: Notebook;
  setNotebookInfo: (info: Notebook) => void;
  updateNotebookInfo: (data: Partial<Notebook>) => void;
}

const initialNotebook: Notebook = {
    created_at: '',
    folder_id: null,
    is_favorite: false,
    notebook_id: '',
    notebook_name: '',
    updated_at: '',
    user_id: '',
};

export const useNotebookStore = create<NotebookStore>((set) => ({
  notebookInfo: initialNotebook,
  
  setNotebookInfo: (info) => set({ notebookInfo: info }),
  
  updateNotebookInfo: (data) => set((state) => ({
    notebookInfo: { ...state.notebookInfo, ...data }
  }))
}));