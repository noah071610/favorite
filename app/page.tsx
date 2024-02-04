import PostCard from "./_components/PostCard"
import { dummyPostCards } from "./_utils/faker"
import "./style.scss"

// todo: 폰트어썸 npm 삭제하기

export default function HomePage() {
  return (
    <div className="home-wrapper">
      <div className="home">
        {dummyPostCards.map((v) => (
          <PostCard key={v.postId} dummyContentCard={v} />
        ))}
      </div>
    </div>
  )
}
