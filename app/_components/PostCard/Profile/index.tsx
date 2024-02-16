import { likeMutate } from "@/_queries/post"
import { getUser } from "@/_queries/user"
import { UserType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import "./style.scss"

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
  const { data: curUser } = useQuery<UserType>({
    queryKey: ["getUser"],
    queryFn: () => getUser(1),
  })

  const { userId, userImage } = user

  const { mutate } = likeMutate(postId, curUser?.userId, curUser?.userImage)

  const onClickLike = () => {
    mutate()
  }

  return (
    <div className="post-card-profile">
      <button className="user-image">
        <img src={userImage} alt={`user_image_${userId}`} />
      </button>
      <div className="meta">
        <button onClick={onClickLike} className="meta-content">
          <div className="meta-icon">
            <i className="fa-solid fa-heart" />
          </div>
          <span>{like}</span>
        </button>
        <button className="meta-content">
          <div className="meta-icon">
            <i className="fa-solid fa-arrow-up-from-bracket" />
          </div>
          <span>{shareCount}</span>
        </button>
      </div>
    </div>
  )
}
