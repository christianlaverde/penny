import { useTransactions } from '../hooks/useTransactions'
import { useUIStore } from '../store/ui'
import { TransactionRowSkeleton } from './LoadingSkeleton'
import type { Transaction } from '../types'

/**
 * Transaction table with filtering by account
 * Displays transactions in a responsive table
 */
export function TransactionTable() {
  const { filterAccountId, clearFilters, openTransactionModal, openEditTransactionModal, openDeleteConfirm } = useUIStore()
  const { data: transactions, isLoading, error } = useTransactions(filterAccountId)

  const handleContextMenu = (e: React.MouseEvent, transactionId: number) => {
    e.preventDefault()

    const menu = document.createElement('div')
    menu.className = 'fixed bg-white shadow-lg border border-gray-200 rounded py-1 z-50'
    menu.style.left = `${e.clientX}px`
    menu.style.top = `${e.clientY}px`

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Edit'
    editBtn.className = 'block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
    editBtn.onclick = () => {
      openEditTransactionModal(transactionId)
      document.body.removeChild(menu)
    }

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.className = 'block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
    deleteBtn.onclick = () => {
      openDeleteConfirm('transaction', transactionId)
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <TransactionRowSkeleton />
              <TransactionRowSkeleton />
              <TransactionRowSkeleton />
              <TransactionRowSkeleton />
              <TransactionRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-sm text-red-600">Error loading transactions</div>
      </div>
    )
  }

  if (!transactions) {
    return null
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Transactions</h2>
        <div className="flex items-center gap-3">
          {filterAccountId && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear filter
            </button>
          )}
          <button
            onClick={openTransactionModal}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 hover:cursor-pointer"
          >
            + New
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-sm text-gray-500">No transactions found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onContextMenu={(e) => handleContextMenu(e, transaction.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {transaction.debitAccount.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {transaction.creditAccount.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                    ${transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
