"use client"

import { useQuery } from "@tanstack/react-query"
import PostCard from "./_components/PostCard"
import { getPosts } from "./_queries/post"
import { PostCardType } from "./_types/post"
import "./style.scss"

export default function HomePage() {
  const { error, data: postCards } = useQuery<PostCardType[]>({
    queryKey: ["getPosts"],
    queryFn: () => getPosts("all", 1),
  })

  return (
    <div className="home-wrapper">
      <div className="home">
        {postCards?.map((v) => (
          <PostCard key={v.postId} postCard={v} />
        ))}
      </div>
    </div>
  )
}
