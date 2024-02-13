import { likeMutate } from "@/_queries/post"
import { UserType } from "@/_types/post"
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
  const { userId, userImage, liked } = user

  const { mutate } = likeMutate(userId, postId)

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
