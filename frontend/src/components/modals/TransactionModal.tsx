import { useState, useEffect, FormEvent } from 'react'
import { useUIStore } from '../../store/ui'
import { useTransactionMutations } from '../../hooks/useTransactionMutations'
import { useTransactions } from '../../hooks/useTransactions'
import { useAccounts } from '../../hooks/useAccounts'

/**
 * Modal for creating and editing transactions
 * Pre-fills form when editing
 */
export function TransactionModal() {
  const { transactionModalOpen, editTransactionId, closeTransactionModal } = useUIStore()
  const { createTransaction, updateTransaction } = useTransactionMutations()
  const { data: transactions } = useTransactions()
  const { data: accountsByType } = useAccounts()

  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [amount, setAmount] = useState('')
  const [debitAccountId, setDebitAccountId] = useState('')
  const [creditAccountId, setCreditAccountId] = useState('')

  const isEditing = editTransactionId !== null
  const isSubmitting = createTransaction.isPending || updateTransaction.isPending

  // Flatten accounts for dropdown
  const allAccounts = accountsByType ? Object.values(accountsByType).flat() : []

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && transactions && editTransactionId) {
      const transaction = transactions.find(t => t.id === editTransactionId)
      if (transaction) {
        setDescription(transaction.description)
        setDate(transaction.date)
        setAmount(transaction.amount.toString())
        setDebitAccountId(transaction.debitAccountId.toString())
        setCreditAccountId(transaction.creditAccountId.toString())
      }
    } else {
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
      setAmount('')
      setDebitAccountId('')
      setCreditAccountId('')
    }
  }, [isEditing, editTransactionId, transactions])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!description.trim() || !amount || !debitAccountId || !creditAccountId) return

    const transactionData = {
      description: description.trim(),
      date,
      amount: parseFloat(amount),
      debitAccountId: parseInt(debitAccountId),
      creditAccountId: parseInt(creditAccountId)
    }

    if (isEditing && editTransactionId) {
      updateTransaction.mutate(
        { id: editTransactionId, ...transactionData },
        { onSuccess: () => handleClose() }
      )
    } else {
      createTransaction.mutate(transactionData, {
        onSuccess: () => handleClose()
      })
    }
  }

  const handleClose = () => {
    closeTransactionModal()
    setDescription('')
    setDate(new Date().toISOString().split('T')[0])
    setAmount('')
    setDebitAccountId('')
    setCreditAccountId('')
  }

  if (!transactionModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-bold mb-4">
          {isEditing ? 'Edit Transaction' : 'New Transaction'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="debit" className="block text-sm font-medium text-gray-700 mb-1">
              Debit Account
            </label>
            <select
              id="debit"
              value={debitAccountId}
              onChange={(e) => setDebitAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select account...</option>
              {allAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.type})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="credit" className="block text-sm font-medium text-gray-700 mb-1">
              Credit Account
            </label>
            <select
              id="credit"
              value={creditAccountId}
              onChange={(e) => setCreditAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select account...</option>
              {allAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.type})
                </option>
              ))}
            </select>
          </div>

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
              disabled={isSubmitting || !description.trim() || !amount || !debitAccountId || !creditAccountId}
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
