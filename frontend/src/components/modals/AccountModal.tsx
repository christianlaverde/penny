import { useState, useEffect, FormEvent } from 'react'
import { useUIStore } from '../../store/ui'
import { useAccountMutations } from '../../hooks/useAccountMutations'
import { useAccounts } from '../../hooks/useAccounts'
import { AccountType } from '../../types'

/**
 * Modal for creating and editing accounts
 * Pre-fills form when editing
 */
export function AccountModal() {
  const { accountModalOpen, editAccountId, closeAccountModal } = useUIStore()
  const { createAccount, updateAccount } = useAccountMutations()
  const { data: accountsByType } = useAccounts()

  const [name, setName] = useState('')
  const [type, setType] = useState<AccountType>(AccountType.ASSET)

  const isEditing = editAccountId !== null
  const isSubmitting = createAccount.isPending || updateAccount.isPending

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && accountsByType && editAccountId) {
      const allAccounts = Object.values(accountsByType).flat()
      const account = allAccounts.find(a => a.id === editAccountId)
      if (account) {
        setName(account.name)
        setType(account.type)
      }
    } else {
      setName('')
      setType(AccountType.ASSET)
    }
  }, [isEditing, editAccountId, accountsByType])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    if (isEditing && editAccountId) {
      updateAccount.mutate(
        { id: editAccountId, name: name.trim() },
        { onSuccess: () => closeAccountModal() }
      )
    } else {
      createAccount.mutate(
        { name: name.trim(), type },
        { onSuccess: () => closeAccountModal() }
      )
    }
  }

  const handleClose = () => {
    closeAccountModal()
    setName('')
    setType(AccountType.ASSET)
  }

  if (!accountModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-bold mb-4">
          {isEditing ? 'Edit Account' : 'New Account'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="account-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="account-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoFocus
            />
          </div>

          {!isEditing && (
            <div className="mb-6">
              <label htmlFor="account-type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="account-type"
                value={type}
                onChange={(e) => setType(e.target.value as AccountType)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(AccountType).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
