"use client"

import { getImageUrl } from "@/_data"
import { fadeMoveUpAnimation } from "@/_styles/animation"
import { CandidateType } from "@/_types/post"
import classNames from "classNames"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function SelectPart({
  isMobile,
  selectedCandidate,
  onClickCandidate,
  onSelectModal,
}: {
  isMobile?: boolean
  selectedCandidate: CandidateType | null
  onClickCandidate: (type: "submit" | "select", candidate?: CandidateType) => void
  onSelectModal?: boolean
}) {
  const { t } = useTranslation(["content"])
  return (
    <div
      className={cx(style["wrapper"], {
        [style.mobile]: isMobile,
        [style.open]: onSelectModal,
      })}
    >
      {selectedCandidate ? (
        <div key={selectedCandidate.listId} className={cx(style["select-part"])}>
          <div
            style={{
              background: getImageUrl({ url: selectedCandidate.imageSrc, isCenter: true }),
            }}
            className={cx(style["image"])}
          />
          <div className={cx(style["description"])}>
            <h2 style={fadeMoveUpAnimation(500, 100)}>{selectedCandidate.title}</h2>
            {selectedCandidate.description?.trim() && (
              <p style={fadeMoveUpAnimation(510, 150)}>{selectedCandidate.description}</p>
            )}
          </div>
          <div className={cx(style["btn"])}>
            <a onClick={() => onClickCandidate("submit")} style={fadeMoveUpAnimation(530, 210)}>
              <span>{selectedCandidate.title} 선택</span>
            </a>
          </div>
        </div>
      ) : (
        <div className={cx(style.unselected)}>
          <div>
            <span>{t("selectCandidate")}</span>
          </div>
        </div>
      )}
    </div>
  )
}
