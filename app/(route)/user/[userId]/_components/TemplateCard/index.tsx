"use client"

import Candidate from "@/_components/Candidate"
import PostCard from "@/_components/PostCard"
import { useMainStore } from "@/_store/main"
import { PollingCandidateType } from "@/_types/post/polling"
import { TemplatePostCardType } from "@/_types/post/post"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function TemplateCard({
  post,
  setTargetTemplate,
}: {
  post: TemplatePostCardType
  setTargetTemplate: (post: TemplatePostCardType | null) => void
}) {
  const { setModal } = useMainStore()

  const onClickUseTemplate = () => {
    setModal("loadTemplate")
    setTargetTemplate(post)
  }

  return (
    <div className={cx(style["template-card"])}>
      <PostCard postCard={post} isTemplate={true} loadTemplate={onClickUseTemplate} />
      <div className={cx(style["candidates"])}>
        <h2>후보 미리보기</h2>
        <div className={cx(style["candidates-inner"])}>
          {post.content.candidates.map((v, i) => (
            <Candidate
              key={`template_list_${post.postId}_${v.listId}`}
              candidate={v as PollingCandidateType}
              onClickCandidate={() => {}}
              index={i}
              isResultPage={false}
              isSelected={false}
              layout="textImage"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
