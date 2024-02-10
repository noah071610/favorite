import { UserType } from "@/_types/post"
import "./style.scss"

export default function Profile({ user, like, shareCount }: { user: UserType; like: number; shareCount: number }) {
  const { userId, userImage } = user
  return (
    <div className="profile">
      <button className="user-image">
        <img src={userImage} alt={`user_image_${userId}`} />
      </button>
      <div className="meta">
        <button className="meta-content">
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
