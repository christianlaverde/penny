import { create } from 'zustand'

interface UIStore {
  // Selected items
  selectedAccountId: number | null

  // Filters
  filterAccountId: number | null

  // Actions
  setSelectedAccount: (id: number | null) => void
  setFilterAccount: (id: number | null) => void
  clearFilters: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  selectedAccountId: null,
  filterAccountId: null,

  // Actions
  setSelectedAccount: (id) => set({ selectedAccountId: id }),
  setFilterAccount: (id) => set({ filterAccountId: id }),
  clearFilters: () => set({ filterAccountId: null })
}))
