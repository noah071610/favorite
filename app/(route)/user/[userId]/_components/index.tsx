"use client"

import { queryKey } from "@/_data"
import { UserQueryType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function UserPost({ userData }: { userData: UserQueryType }) {
  const {
    data: { user },
  } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
    initialData: userData,
  })

  return <>헬로 월드</>
}
