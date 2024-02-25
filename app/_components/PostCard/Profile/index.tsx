import { getUser } from "@/_queries/user"
import { UserType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Profile({
  user,
  like,
  shareCount,
  postId,
}: {
  user: UserType
  like: number
  shareCount: number
  postId: string
}) {
  const { data: user } = useQuery<UserType>({
    queryKey: ["user"],
    queryFn: getUser,
  })

  const { userId, userImage } = user

  // const { mutate } = likeMutate(postId, curUser?.userId, curUser?.userImage)

  const onClickLike = () => {
    // mutate()
  }

  return (
    <div className={cx(style["post-card-profile"])}>
      <button className={cx(style["user-image"])}>
        <img src={userImage} alt={`user_image_${userId}`} />
      </button>
      <div className={cx(style.meta)}>
        <button onClick={onClickLike} className={cx(style["meta-content"])}>
          <div className={cx(style["meta-icon"])}>
            <i className={cx("fa-solid", "fa-heart")} />
          </div>
          <span>{like}</span>
        </button>
        <button className={cx(style["meta-content"])}>
          <div className={cx(style["meta-icon"])}>
            <i className={cx("fa-solid", "fa-arrow-up-from-bracket")} />
          </div>
          <span>{shareCount}</span>
        </button>
      </div>
    </div>
  )
}
