import { PostCardType } from "@/_types/post"

function createMockPostCard(options?: Partial<PostCardType>): PostCardType {
  const defaultPostCard: PostCardType = {
    postId: "123123123",
    type: "polling",
    title: "Sample Title",
    description: "Sample Description",
    format: "default",
    count: 100,
    thumbnail: "https://example.com/thumbnail.jpg",
    popular: 50,
    createdAt: new Date(),
    lastPlayedAt: new Date(),
  }

  return { ...defaultPostCard, ...options }
}

// 모의 데이터 생성

describe("Main", () => {})
