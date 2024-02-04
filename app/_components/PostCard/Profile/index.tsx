import { UserType } from "@/_types/post"
import { faHeart } from "@fortawesome/free-regular-svg-icons"
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./style.scss"

export default function Profile({ user, like, shareCount }: { user: UserType; like: number; shareCount: number }) {
  const { userId, userImage, userName } = user
  return (
    <div className="profile">
      <button className="user-image">
        <img src={userImage} alt={`user_image_${userId}`} />
      </button>
      <div className="meta">
        <button className="meta-content">
          <div className="meta-icon">
            <FontAwesomeIcon icon={faHeart} />
          </div>
          <span>{like}</span>
        </button>
        <button className="meta-content">
          <div className="meta-icon">
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
          </div>
          <span>{shareCount}</span>
        </button>
      </div>
    </div>
  )
}
