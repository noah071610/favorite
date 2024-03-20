"use server"

import { LangParamsType } from "@/_types"
import UserPageMain from "./_components"

// type Props = {
//   params: { userId: string }
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   return {
//     title: "대시보드",
//   }
// }

export default async function UserPage({ params: { lang } }: LangParamsType) {
  return <UserPageMain />
}
