
import { create } from 'zustand'

interface UserStore {
  user: UserAndSubscription | null
  setUser: (user: UserAndSubscription | null) => void
  countPdf: number
  setCountPdf: (countPdf: number) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  countPdf: 0,
  setCountPdf: (countPdf) => set({ countPdf })
}))