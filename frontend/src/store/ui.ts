import { create } from 'zustand'

interface UIStore {
  // Selected items
  selectedAccountId: number | null
  selectedTransactionId: number | null

  // Filters
  filterAccountId: number | null

  // Modal state
  accountModalOpen: boolean
  editAccountId: number | null
  transactionModalOpen: boolean
  editTransactionId: number | null
  deleteConfirmOpen: boolean
  deleteTarget: { type: 'account' | 'transaction'; id: number } | null

  // Actions
  setSelectedAccount: (id: number | null) => void
  setFilterAccount: (id: number | null) => void
  clearFilters: () => void

  // Modal actions
  openAccountModal: () => void
  openEditAccountModal: (id: number) => void
  closeAccountModal: () => void
  openTransactionModal: () => void
  openEditTransactionModal: (id: number) => void
  closeTransactionModal: () => void
  openDeleteConfirm: (type: 'account' | 'transaction', id: number) => void
  closeDeleteConfirm: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  selectedAccountId: null,
  selectedTransactionId: null,
  filterAccountId: null,
  accountModalOpen: false,
  editAccountId: null,
  transactionModalOpen: false,
  editTransactionId: null,
  deleteConfirmOpen: false,
  deleteTarget: null,

  // Actions
  setSelectedAccount: (id) => set({ selectedAccountId: id }),
  setFilterAccount: (id) => set({ filterAccountId: id }),
  clearFilters: () => set({ filterAccountId: null }),

  // Modal actions
  openAccountModal: () => set({ accountModalOpen: true, editAccountId: null }),
  openEditAccountModal: (id) => set({ accountModalOpen: true, editAccountId: id }),
  closeAccountModal: () => set({ accountModalOpen: false, editAccountId: null }),
  openTransactionModal: () => set({ transactionModalOpen: true, editTransactionId: null }),
  openEditTransactionModal: (id) => set({ transactionModalOpen: true, editTransactionId: id }),
  closeTransactionModal: () => set({ transactionModalOpen: false, editTransactionId: null }),
  openDeleteConfirm: (type, id) => set({ deleteConfirmOpen: true, deleteTarget: { type, id } }),
  closeDeleteConfirm: () => set({ deleteConfirmOpen: false, deleteTarget: null })
}))
