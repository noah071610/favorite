"use client"

import Candidate from "@/_components/Candidate"
import PostCard from "@/_components/PostCard"
import { useMainStore } from "@/_store/main"
import { PollingCandidateType } from "@/_types/post/polling"
import { TemplatePostCardType } from "@/_types/post/post"
import { faChevronUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function TemplateCard({
  post,
  setTargetTemplate,
}: {
  post: TemplatePostCardType
  setTargetTemplate: (post: TemplatePostCardType | null) => void
}) {
  const { t } = useTranslation(["content"])
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
          <h2>{t("candidatePreview")}</h2>
          <button className={cx({ [style.open]: openCandidateList })}>
            <FontAwesomeIcon icon={faChevronUp} />
          </button>
        </div>
        <div className={cx(style["candidates-inner"], { [style.open]: openCandidateList })}>
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
