import { create } from 'zustand'

type FolderPath = {
  id: string
  name: string
}

type FolderItem = {
  id: string
  name: string
  type: 'folder' | 'notebook'
  children?: FolderItem[]
}

interface FolderNavigationState {
  currentPath: FolderPath[]
  folderTree: FolderItem[]
  expandedFolders: Set<string>
  currentItemId: string | null
  username: string
  setCurrentPath: (path: FolderPath[]) => void
  setCurrentItemId: (id: string) => void
  setFolderTree: (tree: FolderItem[]) => void
  toggleFolder: (folderId: string) => void
  setUsername: (username: string) => void
}

export const useFolderNavigationStore = create<FolderNavigationState>((set) => ({
  currentPath: [{ id: 'root', name: 'Root' }],
  folderTree: [{ id: 'root', name: 'Root', type: 'folder', children: [] }],
  expandedFolders: new Set(['root']),
  currentItemId: null,
  username: '',

  setCurrentPath: (path) => set({ currentPath: path }),
  setCurrentItemId: (id) => set({ currentItemId: id }),
  setFolderTree: (tree) => set({ folderTree: tree }),
  setUsername: (username) => set({ username }),

  toggleFolder: (folderId) => set((state) => {
    const newSet = new Set(state.expandedFolders)
    if (newSet.has(folderId)) {
      newSet.delete(folderId)
    } else {
      newSet.add(folderId)
    }
    return { expandedFolders: newSet }
  })
}))