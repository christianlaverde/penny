import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/Layout'
import { TransactionTable } from './components/TransactionTable'

const queryClient = new QueryClient()

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <TransactionTable />
        </Layout>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
