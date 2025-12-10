import axios from 'axios'
import type { ApiResponse, Account, Transaction, AccountsByType } from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const accountsApi = {
  /**
   * Fetch all accounts grouped by type
   */
  getAll: async (): Promise<AccountsByType> => {
    const { data } = await api.get<ApiResponse<AccountsByType>>('/accounts')
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch accounts')
    }
    return data.data
  }
}

export const transactionsApi = {
  /**
   * Fetch all transactions, optionally filtered by account
   * @param accountId - Optional account ID to filter by
   */
  getAll: async (accountId?: number): Promise<Transaction[]> => {
    const params = accountId ? { account_id: accountId } : {}
    const { data } = await api.get<ApiResponse<Transaction[]>>('/transactions', { params })
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch transactions')
    }
    return data.data
  }
}

export default api
