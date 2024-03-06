"use client"

import { queryKey } from "@/_data"
import { UserQueryType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import UserPageError from "./error"
import UserPageLoading from "./loading"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function UserPost() {
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
  })

  return <>{userData ? userData.msg === "no" ? <UserPageError /> : <div></div> : <UserPageLoading />}</>
}
