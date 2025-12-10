import { useAccounts } from '../hooks/useAccounts'
import { useUIStore } from '../store/ui'

/**
 * Mobile bottom navigation (visible below 768px)
 * Shows account filter with dropdown
 */
export function MobileNav() {
  const { data: accountsByType } = useAccounts()
  const { filterAccountId, setFilterAccount, clearFilters } = useUIStore()

  if (!accountsByType) {
    return null
  }

  // Flatten accounts from all types
  const allAccounts = Object.values(accountsByType).flat()

  return (
    <div className="md:hidden border-t border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <label htmlFor="account-filter" className="text-sm font-medium text-gray-700">
          Filter:
        </label>
        <select
          id="account-filter"
          value={filterAccountId ?? ''}
          onChange={(e) => {
            const value = e.target.value
            setFilterAccount(value ? Number(value) : null)
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
        >
          <option value="">All Accounts</option>
          {allAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        {filterAccountId && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
