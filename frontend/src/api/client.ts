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
  },

  /**
   * Create a new account
   * @param name - Account name
   * @param type - Account type (ASSET, LIABILITY, etc.)
   */
  create: async (name: string, type: string): Promise<Account> => {
    const { data } = await api.post<ApiResponse<Account>>('/accounts', { name, type })
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to create account')
    }
    return data.data
  },

  /**
   * Update an account's name
   * @param id - Account ID
   * @param name - New account name
   */
  update: async (id: number, name: string): Promise<Account> => {
    const { data } = await api.patch<ApiResponse<Account>>(`/accounts/${id}`, { name })
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to update account')
    }
    return data.data
  },

  /**
   * Soft delete an account
   * @param id - Account ID
   */
  delete: async (id: number): Promise<void> => {
    const { data } = await api.delete<ApiResponse<void>>(`/accounts/${id}`)
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete account')
    }
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
  },

  /**
   * Create a new transaction
   */
  create: async (transaction: {
    description: string
    date: string
    amount: number
    debitAccountId: number
    creditAccountId: number
  }): Promise<Transaction> => {
    const { data } = await api.post<ApiResponse<Transaction>>('/transactions', transaction)
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to create transaction')
    }
    return data.data
  },

  /**
   * Update a transaction
   */
  update: async (id: number, transaction: {
    description: string
    date: string
    amount: number
    debitAccountId: number
    creditAccountId: number
  }): Promise<Transaction> => {
    const { data } = await api.patch<ApiResponse<Transaction>>(`/transactions/${id}`, transaction)
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to update transaction')
    }
    return data.data
  },

  /**
   * Soft delete a transaction
   */
  delete: async (id: number): Promise<void> => {
    const { data } = await api.delete<ApiResponse<void>>(`/transactions/${id}`)
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete transaction')
    }
  }
}

export default api
