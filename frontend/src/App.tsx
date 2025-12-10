import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/Layout'
import { TransactionTable } from './components/TransactionTable'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <TransactionTable />
      </Layout>
    </QueryClientProvider>
  )
}

export default App
