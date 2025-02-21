
import { create } from 'zustand'



interface NotebookStore {
  notebookInfo: NotebookInfo;
  setNotebookInfo: (info: NotebookInfo) => void;
  updateNotebookInfo: (data: Partial<NotebookInfo>) => void;
}

const initialNotebook: NotebookInfo = {
    created_at: '',
    folder_id: null,
    is_favorite: false,
    notebook_id: '',
    notebook_name: '',
    updated_at: '',
    user_id: '',
    pdf_document: {
      file_path: '',
      file_name: '',
      file_size: '',
      cache_expiration: '',
      cache_id: '',
      created_at: '',
      notebook_id: '',
      pdf_id: '',
      pdf_temp_expiration: '',
      pdf_temp_path: '',
      pdf_hash: '',
    }
};

export const useNotebookStore = create<NotebookStore>((set) => ({
  notebookInfo: initialNotebook,
  
  setNotebookInfo: (info) => set({ notebookInfo: info }),
  
  updateNotebookInfo: (data) => set((state) => ({
    notebookInfo: { ...state.notebookInfo, ...data }
  }))
}));