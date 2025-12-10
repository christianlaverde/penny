import { useAccounts } from '../hooks/useAccounts'
import { AccountGroup } from './AccountGroup'
import { useUIStore } from '../store/ui'

/**
 * Sidebar displaying accounts grouped by type
 * Shows loading/error states, with "+" button to add accounts
 */
export function Sidebar() {
  const { data: accountsByType, isLoading, error } = useAccounts()
  const { openAccountModal } = useUIStore()

  if (isLoading) {
    return (
      <div className="w-64 border-r border-gray-200 p-4 hidden md:block">
        <div className="text-sm text-gray-500">Loading accounts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-64 border-r border-gray-200 p-4 hidden md:block">
        <div className="text-sm text-red-600">Error loading accounts</div>
      </div>
    )
  }

  if (!accountsByType) {
    return null
  }

  return (
    <div className="w-64 border-r border-gray-200 p-4 hidden md:block">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-lg font-bold">Accounts</h2>
        <button
          onClick={openAccountModal}
          className="w-6 h-6 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded"
          title="Add account"
        >
          +
        </button>
      </div>

      {Object.entries(accountsByType).map(([type, accounts]) => (
        <AccountGroup
          key={type}
          title={type}
          accounts={accounts}
        />
      ))}
    </div>
  )
}
