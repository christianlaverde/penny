import { useAccounts } from '../hooks/useAccounts'
import { AccountGroup } from './AccountGroup'
import { AccountType } from '../types'

/**
 * Sidebar displaying accounts grouped by type
 * Shows loading/error states
 */
export function Sidebar() {
  const { data: accountsByType, isLoading, error } = useAccounts()

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
      <h2 className="text-lg font-bold mb-4 px-4">Accounts</h2>

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
