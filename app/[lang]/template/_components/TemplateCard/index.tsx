"use client"

import PostCard from "@/_components/PostCard"
import { useMainStore } from "@/_store/main"
import { PostType } from "@/_types/post"
import { faChevronUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useState } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function TemplateCard({
  post,
  title,
  setTargetTemplate,
}: {
  post: PostType
  title: string
  setTargetTemplate: (post: PostType | null) => void
}) {
  const [openCandidateList, setOpenCandidateList] = useState(false)
  const { setModal } = useMainStore()

  const onClickUseTemplate = () => {
    setModal("loadTemplate")
    setTargetTemplate(post)
  }

  const onClickOpenCandidateList = () => {
    setOpenCandidateList((b) => !b)
  }

  return (
    <div className={cx(style["template-card"])}>
      <PostCard postCard={post} isTemplate={true} loadTemplate={onClickUseTemplate} />
      <div className={cx(style["candidates"])}>
        <div onClick={onClickOpenCandidateList} className={cx(style.title)}>
          <h2>{title}</h2>
          <button className={cx({ [style.open]: openCandidateList })}>
            <FontAwesomeIcon icon={faChevronUp} />
          </button>
        </div>
        {/* <div className={cx(style["candidates-inner"], { [style.open]: openCandidateList })}>
          {post.content.candidates.map((v, i) => (
            <Candidate
              key={`template_list_${post.postId}_${v.listId}`}
              candidate={v}
              onClickCandidate={() => {}}
              index={i}
              isResultPage={false}
              isSelected={false}
              layout="textImage"
            />
          ))}
        </div> */}
      </div>
    </div>
  )
}
