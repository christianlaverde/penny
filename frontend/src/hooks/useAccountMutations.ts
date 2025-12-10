import { useMutation, useQueryClient } from '@tanstack/react-query'
import { accountsApi } from '../api/client'
import toast from 'react-hot-toast'

/**
 * Hook for account mutations (create, update, delete)
 * Auto-invalidates accounts query on success
 */
export function useAccountMutations() {
  const queryClient = useQueryClient()

  const createAccount = useMutation({
    mutationFn: ({ name, type }: { name: string; type: string }) =>
      accountsApi.create(name, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Account created')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create account')
    }
  })

  const updateAccount = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      accountsApi.update(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Account updated')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update account')
    }
  })

  const deleteAccount = useMutation({
    mutationFn: (id: number) => accountsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Account deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete account')
    }
  })

  return {
    createAccount,
    updateAccount,
    deleteAccount
  }
}
