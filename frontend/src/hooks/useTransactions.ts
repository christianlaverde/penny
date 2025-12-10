import { useQuery } from '@tanstack/react-query'
import { transactionsApi } from '../api/client'

/**
 * Fetch all transactions, optionally filtered by account
 * @param accountId - Optional account ID to filter by
 */
export function useTransactions(accountId?: number | null) {
  return useQuery({
    queryKey: ['transactions', accountId],
    queryFn: () => transactionsApi.getAll(accountId ?? undefined),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2
  })
}
