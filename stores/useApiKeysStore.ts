
import { create } from 'zustand'

type ApiKeys = {
  gemini_key: string | null
}

type ApiKeysStore = {
  apiKeys: ApiKeys
  userId: string
  updateApiKeys: (newKeys: Partial<ApiKeys>) => void
  setUserId: (id: string) => void
}

export const useApiKeysStore = create<ApiKeysStore>((set) => ({
  apiKeys: {
    gemini_key: null
  },
  userId: '',
  updateApiKeys: (newKeys) =>
    set((state) => ({
      apiKeys: { ...state.apiKeys, ...newKeys }
    })),
  setUserId: (id) => set({ userId: id })
}))

// Hook de utilidad para obtener una clave específica
export const useApiKey = (keyName: keyof ApiKeys): string | null => {
  return useApiKeysStore((state) => state.apiKeys[keyName])
}