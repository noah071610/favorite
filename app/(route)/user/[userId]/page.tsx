import { Metadata } from "next"
import UserPageMain from "./_components"

type Props = {
  params: { userId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "대시보드",
  }
}

export default function UserPage() {
  return <UserPageMain />
}
