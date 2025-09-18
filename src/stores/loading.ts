import { create } from 'zustand'

interface LoadingState {
  isLoading: boolean
  loadingCount: number
  loadingText: string
  setLoading: (loading: boolean, text?: string) => void
  forceHideLoading: () => void
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  isLoading: false,
  loadingCount: 0,
  loadingText: '',

  setLoading: (loading: boolean, text = '') => {
    const { loadingCount } = get()

    if (loading) {
      const newCount = loadingCount + 1
      set({
        loadingCount: newCount,
        isLoading: newCount === 1,
        loadingText: newCount === 1 ? text : get().loadingText,
      })
    } else {
      const newCount = Math.max(0, loadingCount - 1)
      set({
        loadingCount: newCount,
        isLoading: newCount > 0,
        loadingText: newCount === 0 ? '' : get().loadingText,
      })
    }
  },

  forceHideLoading: () => {
    set({
      isLoading: false,
      loadingCount: 0,
      loadingText: '',
    })
  },
}))
