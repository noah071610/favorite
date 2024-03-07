"use client"

import PostCard from "@/_components/PostCard"
import { queryKey } from "@/_data"
import { chartBackgroundColors } from "@/_data/chart"
import { getUserPosts } from "@/_queries/post"
import { PostCardType } from "@/_types/post/post"
import { UserQueryType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { useParams } from "next/navigation"
import UserPageError from "../error"
import UserPageLoading from "../loading"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function UserPageMain() {
  const { userId: queryUserId } = useParams()
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
  })
  const user = userData?.user

  const { data: userPosts } = useQuery<PostCardType[]>({
    queryKey: queryKey.userPost,
    queryFn: () => getUserPosts(user!.userId),
    enabled: !!(user?.userId === parseInt(queryUserId as string)),
  })

  return (
    <>
      {userData ? (
        !user ? (
          <UserPageError />
        ) : (
          <div className={cx(style["user-page"])}>
            <div className={cx(style.inner)}>
              <div className={style["profile"]}>
                <div className={style["user-icon"]}>
                  <div style={{ backgroundColor: chartBackgroundColors[1] }} className={style["icon"]}>
                    <span>{user.userName.slice(0, 1)}</span>
                  </div>
                </div>
                <div className={style["user-info"]}>
                  <span>{user.userName}</span>
                </div>
              </div>
              <div className={cx(style.grid)}>
                {userPosts?.map((v: PostCardType) => (
                  <PostCard key={v.postId} postCard={v} />
                ))}
              </div>
            </div>
          </div>
        )
      ) : (
        <UserPageLoading />
      )}
    </>
  )
}
