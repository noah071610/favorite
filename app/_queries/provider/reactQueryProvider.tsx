"use client"
import { _url } from "@/_data"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import axios from "axios"
import { PropsWithChildren, useState } from "react"

export const server = axios.create({
  baseURL: _url.server, // Replace with your base URL
})
// Options
const queryClientOptions = {
  defaultOptions: {
    queries: {
      baseURL: _url.server,
      refetchOnWindowFocus: false,
      staleTime: 300000,
    },
  },
}

const ReactQueryProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClientStore] = useState(() => new QueryClient(queryClientOptions))

  return (
    <QueryClientProvider client={queryClientStore}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default ReactQueryProvider
