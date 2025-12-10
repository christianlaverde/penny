import { useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionsApi } from '../api/client'
import toast from 'react-hot-toast'

interface TransactionInput {
  description: string
  date: string
  amount: number
  debitAccountId: number
  creditAccountId: number
}

/**
 * Hook for transaction mutations (create, update, delete)
 * Auto-invalidates transactions and accounts queries on success
 */
export function useTransactionMutations() {
  const queryClient = useQueryClient()

  const createTransaction = useMutation({
    mutationFn: (transaction: TransactionInput) =>
      transactionsApi.create(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Transaction created')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create transaction')
    }
  })

  const updateTransaction = useMutation({
    mutationFn: ({ id, ...transaction }: TransactionInput & { id: number }) =>
      transactionsApi.update(id, transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Transaction updated')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update transaction')
    }
  })

  const deleteTransaction = useMutation({
    mutationFn: (id: number) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Transaction deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete transaction')
    }
  })

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction
  }
}
