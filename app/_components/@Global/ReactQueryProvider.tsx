"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PropsWithChildren, useState } from "react"

import { _url } from "@/_data"
import { CookiesProvider } from "react-cookie"

const STALE_TIME = 1000 * 60 * 5 // 5 minutes

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: STALE_TIME,
      baseURL: _url.server,
      retry: 0,
      retryDelay: 1000,
    },
  },
}

const ReactQueryProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClientStore] = useState(() => new QueryClient(queryClientConfig))

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClientStore}>
        {children}
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </CookiesProvider>
  )
}

export default ReactQueryProvider
