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
  const { selectedAccountId, setSelectedAccount, setFilterAccount, openEditAccountModal, openDeleteConfirm } = useUIStore()

  const handleAccountClick = (accountId: number) => {
    setSelectedAccount(accountId)
    setFilterAccount(accountId)
  }

  const handleContextMenu = (e: React.MouseEvent, accountId: number) => {
    e.preventDefault()

    const menu = document.createElement('div')
    menu.className = 'fixed bg-white shadow-lg border border-gray-200 rounded py-1 z-50'
    menu.style.left = `${e.clientX}px`
    menu.style.top = `${e.clientY}px`

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Rename'
    editBtn.className = 'block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
    editBtn.onclick = () => {
      openEditAccountModal(accountId)
      document.body.removeChild(menu)
    }

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.className = 'block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
    deleteBtn.onclick = () => {
      openDeleteConfirm('account', accountId)
      document.body.removeChild(menu)
    }

    menu.appendChild(editBtn)
    menu.appendChild(deleteBtn)
    document.body.appendChild(menu)

    const closeMenu = () => {
      if (document.body.contains(menu)) {
        document.body.removeChild(menu)
      }
      document.removeEventListener('click', closeMenu)
    }
    setTimeout(() => document.addEventListener('click', closeMenu), 0)
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:cursor-pointer rounded"
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
              onContextMenu={(e) => handleContextMenu(e, account.id)}
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
