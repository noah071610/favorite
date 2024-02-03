import ContentCard from "./_components/ContentCard"
import { ContentCardType } from "./_types/post"
import { generateRandomDescription } from "./_utils/random_kr"
import "./style.scss"

export default function Home() {
  const dummyContentCards: ContentCardType[] = Array.from({ length: 10 }, (_, index) => ({
    title: `Card ${index + 1}`,
    description: generateRandomDescription(),
    images: Array.from({ length: Math.floor(Math.random() * 4) + 2 }).map(
      (_, i) => `https://picsum.photos/id/${index * 10 + i * 10}/1200/800`
    ),
    postId: `post${index + 1}`,
    user: {
      userId: `user${index + 1}`,
      userName: `User ${index + 1}`,
      userImage: `https://placekitten.com/50/5${index + 1}`,
    },
  }))

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