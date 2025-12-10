import { useState } from 'react'
import type { Account } from '../types'
import { useUIStore } from '../store/ui'

interface AccountGroupProps {
  title: string
  accounts: Account[]
}

/**
 * Collapsible account category group (Assets, Liabilities, etc.)
 * Displays accounts with their balances
 */
export function AccountGroup({ title, accounts }: AccountGroupProps) {
  const [isOpen, setIsOpen] = useState(true)
  const { selectedAccountId, setSelectedAccount, setFilterAccount } = useUIStore()

  const handleAccountClick = (accountId: number) => {
    setSelectedAccount(accountId)
    setFilterAccount(accountId)
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded"
      >
        <span className="text-gray-500">{isOpen ? '▼' : '▶'}</span>
        <span>{title}</span>
      </button>

      {isOpen && (
        <div className="mt-1">
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => handleAccountClick(account.id)}
              className={`w-full flex items-center justify-between px-6 py-2 text-sm hover:bg-gray-100 rounded ${
                selectedAccountId === account.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span>{account.name}</span>
              <span className="font-mono text-xs">${account.balance.toFixed(2)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
