
import { create } from 'zustand'
import { useRouter } from 'next/navigation'

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
  setCurrentPath: (path: FolderPath[]) => void
  navigateToFolder: (folderId: string, folderName: string) => void
  navigateUp: () => void
  reload: () => void
  setFolderTree: (tree: FolderItem[]) => void
  toggleFolder: (folderId: string) => void
}

export const useFolderNavigationStore = create<FolderNavigationState>((set, get) => ({
  currentPath: [{ id: 'root', name: 'Root' }],
  folderTree: [{ id: 'root', name: 'Root', type: 'folder', children: [] }],
  expandedFolders: new Set(['root']),
  currentItemId: null,

  setCurrentPath: (path) => set({ currentPath: path }),

  navigateToFolder: (folderId, folderName) => set((state) => {
    const index = state.currentPath.findIndex(item => item.id === folderId)
    const newPath = index !== -1
      ? state.currentPath.slice(0, index + 1)
      : [...state.currentPath, { id: folderId, name: folderName }]
    
    return {
      currentPath: newPath,
      currentItemId: folderId
    }
  }),

  navigateUp: () => set((state) => {
    const newPath = state.currentPath.slice(0, -1)
    return {
      currentPath: newPath,
      currentItemId: newPath[newPath.length - 1].id
    }
  }),

  reload: () => {
    const router = useRouter()
    router.refresh()
  },

  setFolderTree: (tree) => set({ folderTree: tree }),

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