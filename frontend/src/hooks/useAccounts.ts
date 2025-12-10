import { useQuery } from '@tanstack/react-query'
import { accountsApi } from '../api/client'

/**
 * Fetch all accounts grouped by type
 * Auto-refetches on window focus, caches for 5 minutes
 */
export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2
  })
}
