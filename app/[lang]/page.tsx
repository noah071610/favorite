import { Suspense } from "react"
import ContentPage from "../_pages/ContentPage"

const HomePage = async () => {
  return (
    <Suspense>
      <ContentPage query="all" />
    </Suspense>
  )
}

export default HomePage
