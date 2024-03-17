"use client"

import { getImageUrl } from "@/_data"
import { noImageUrl } from "@/_data/post"
import { fadeMoveUpAnimation } from "@/_styles/animation"
import { CandidateType, ContentLayoutType } from "@/_types/post"
import classNames from "classNames"
import React from "react"
import CountUp from "react-countup"
import { useTranslation } from "react-i18next"

function Candidate({
  candidate,
  onClickCandidate,
  layout,
  isResultPage,
  isSelected,
  index,
}: {
  candidate: CandidateType
  onClickCandidate: (type: "submit" | "select", candidate?: CandidateType) => void
  isResultPage: boolean
  layout: ContentLayoutType
  isSelected: boolean
  index: number
}) {
  const { t } = useTranslation(["content"])
  const { pick, description, title, imageSrc } = candidate

  const titleComponent = () => (
    <div className={classNames("title")}>
      <h3>{title}</h3>
      {isResultPage && (
        <span className={classNames("count")}>
          <CountUp prefix="(" suffix={t("vote") + ")"} duration={4} end={pick} />
        </span>
      )}
    </div>
  )

  return (
    <li
      className={classNames("global-candidate", {
        ["selected"]: isSelected,
        ["result"]: isResultPage,
        [`layout-${layout}`]: layout,
      })}
      onClick={() => onClickCandidate("select", candidate)}
      style={fadeMoveUpAnimation(1100 + index * 20, index * 100)}
    >
      <div className={classNames("border")} />
      {isResultPage && <div className={classNames("number")}>{index + 1}</div>}

      <div className={classNames("inner")}>
        <div className={classNames("image-wrapper")}>
          {layout === "image" && isResultPage && isSelected && <span className={"image-like"}>LIKE!</span>}
          <div
            style={{
              backgroundImage: !!imageSrc ? getImageUrl({ url: imageSrc }) : noImageUrl,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={classNames("image")}
          />
          {layout === "image" && titleComponent()}
          {layout === "image" && <div className={classNames("overlay")} />}
        </div>
        <div
          className={classNames("content", {
            ["text"]: !isResultPage && layout === "text",
          })}
        >
          {titleComponent()}
          {description && <p>{description}</p>}
        </div>
      </div>
      {layout === "text" && !isResultPage && (
        <button onClick={() => onClickCandidate("submit")} className={classNames("select-btn")}>
          <span className={classNames("select")}>{t("select", { title })}</span>
        </button>
      )}
    </li>
  )
}

export default React.memo(Candidate)
