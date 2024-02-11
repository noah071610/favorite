"use client"

import { getUser } from "@/_queries/user"

import { useNewPostStore } from "@/_store/newPost"
import { UserType } from "@/_types/post"
import { useQuery } from "@tanstack/react-query"

import { createNewPost } from "@/_queries/post"
import { useRouter } from "next/navigation"
import "./style.scss"

export default function RendingEditSection() {
  const { data: user } = useQuery<UserType>({
    queryKey: ["getUser"],
    queryFn: () => getUser(1),
  })
  const router = useRouter()
  const { newPost, newCandidates, setSelectedCandidate, setNewPost, setCurrentPostingPage, clearCandidate } =
    useNewPostStore()

  const posting = async () => {
    if (!newPost) {
      return alert("에러 발생")
    }
    const { title } = newPost

    if (title.trim().length < 3) return alert("타이틀은 공백을 제외하고 3글자 이상으로 작성해주세요!")
    if (!user) return alert("로그인이 필요해요")
    if (newCandidates.length < 2) return alert("후보는 적어도 2개 이상 필요해요")
    if (!newCandidates.every(({ title }) => !!title.trim())) return alert("타이틀이 없는 후보가 존재해요")

    await createNewPost({
      ...newPost,
      userId: user.userId,
      info: {
        like: 0,
        participateCount: 0,
        participateImages: [],
        shareCount: 0,
      },
      thumbnail: `https://picsum.photos/id/100/1200/800`, // todo: 썸넬
      content: newCandidates,
    }).then(() => {
      setSelectedCandidate(null)
      setCurrentPostingPage("init")
      setNewPost(null)
      clearCandidate()
      router.push(`/post/${newPost.postId}`)
    })
  }

  return (
    <div className="rending">
      <h1>사람들의 생각이 궁금하지 않나요?</h1>
      <p>이제 다 왔어요!🥳</p>
      <div className="btn-wrapper">
        <button>미리 플레이 해보기</button>
        <button onClick={posting}>포스팅 하기</button>
      </div>
    </div>
  )
}
