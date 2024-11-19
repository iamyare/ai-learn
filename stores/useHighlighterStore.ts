
import { create } from 'zustand'

export type HighlighterAction = 'note' | 'explain' | 'chart' | 'translate'

type ActionHandler = (
  action: HighlighterAction,
  text: string,
  options?: { chartType?: string; targetLanguage?: string }
) => void

interface HighlighterStore {
  actionHandler: ActionHandler
  setActionHandler: (handler: ActionHandler) => void
  triggerAction: ActionHandler
}

export const useHighlighterStore = create<HighlighterStore>((set) => ({
  actionHandler: () => {},
  setActionHandler: (handler) => set({ actionHandler: handler }),
  triggerAction: (action, text, options) => {
    set((state) => {
      state.actionHandler(action, text, options)
      return state
    })
  }
}))