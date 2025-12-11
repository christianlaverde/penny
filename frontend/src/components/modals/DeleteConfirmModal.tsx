import { useEffect } from 'react'
import { useUIStore } from '../../store/ui'
import { useAccountMutations } from '../../hooks/useAccountMutations'
import { useTransactionMutations } from '../../hooks/useTransactionMutations'

/**
 * Reusable delete confirmation modal
 * Handles deletion of accounts and transactions
 * ESC to close
 */
export function DeleteConfirmModal() {
  const { deleteConfirmOpen, deleteTarget, closeDeleteConfirm } = useUIStore()
  const { deleteAccount } = useAccountMutations()
  const { deleteTransaction } = useTransactionMutations()

  // ESC to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && deleteConfirmOpen) {
        closeDeleteConfirm()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [deleteConfirmOpen, closeDeleteConfirm])

  if (!deleteConfirmOpen || !deleteTarget) return null

  const handleDelete = () => {
    if (deleteTarget.type === 'account') {
      deleteAccount.mutate(deleteTarget.id, {
        onSuccess: () => closeDeleteConfirm()
      })
    } else {
      deleteTransaction.mutate(deleteTarget.id, {
        onSuccess: () => closeDeleteConfirm()
      })
    }
  }

  const isDeleting = deleteAccount.isPending || deleteTransaction.isPending

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this {deleteTarget.type}? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={closeDeleteConfirm}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
