import ContentCard from "./_components/ContentCard"
import { dummyContentCards } from "./_utils/faker"
import "./style.scss"

// todo: 슬릭 카로셀 npnm 삭제하기

export default function Home() {
  return (
    <main className="contents-wrapper">
      <div className="contents">
        {dummyContentCards.map((v) => (
          <ContentCard key={v.postId} dummyContentCard={v} />
        ))}
      </div>
    </main>
  )
}
