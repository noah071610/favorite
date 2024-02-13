import { cache } from "react"

import { _url } from "@/_data"
import { QueryClient } from "@tanstack/react-query"

const STALE_TIME = 1000 * 60 * 5 // 5 minutes

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: STALE_TIME,
      baseURL: _url.server,
      retry: 1,
      retryDelay: 1000,
    },
    mutations: {
      onError: (error: Error) => {
        /** You can use toast or notification here */
        console.error(error.message)
      },
    },
  },
}

export const getQueryClient = cache(() => new QueryClient(queryClientConfig))
