export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum NormalBalance {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT'
}

export interface Account {
  id: number
  name: string
  type: AccountType
  balance: number
  normalBalance: NormalBalance
  isActive: boolean
  createdAt: string
}

export interface Transaction {
  id: number
  description: string
  date: string
  amount: number
  debitAccountId: number
  creditAccountId: number
  debitAccount: {
    id: number
    name: string
    type: AccountType
  }
  creditAccount: {
    id: number
    name: string
    type: AccountType
  }
  isActive: boolean
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: string
}

export interface AccountsByType {
  [key: string]: Account[]
}
