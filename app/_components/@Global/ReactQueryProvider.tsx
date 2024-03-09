"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PropsWithChildren, useEffect, useState } from "react"

import { _url } from "@/_data"
import i18n from "@/_utils/i18n"
import { I18nextProvider } from "react-i18next"

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

  useEffect(() => {
    const lang = localStorage.getItem("favorite_lang")
    if (lang) {
      i18n.changeLanguage(lang)
    }
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClientStore}>
        {children}
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default ReactQueryProvider
