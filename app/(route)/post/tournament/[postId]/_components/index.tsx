"use client"

import { TournamentCandidateType, TournamentPostType } from "@/_types/post/tournament"
import { useEffect, useMemo, useState } from "react"

import FavoriteLoading from "@/_components/Loading/FavoriteLoading"
import PostInfo from "@/_components/PostInfo"
import { usePreloadImages } from "@/_hooks/usePreloadImages"
import { useMainStore } from "@/_store/main"
import classNames from "classNames"
import ResultPart from "./ResultPart"
import SelectPart from "./SelectPart"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const _rounds = [4, 8, 16, 32, 64, 128, 256]

const getRound = (totalParticipants: number | undefined) => {
  if (!totalParticipants) return { rounds: null }
  for (let i = 0; i < _rounds.length; i++) {
    if (_rounds[i] >= totalParticipants) {
      return { rounds: _rounds.slice(0, i + 1) }
    }
  }
  return { rounds: null }
}

export default function TournamentPost({ post }: { post: TournamentPostType }) {
  const [round, setRound] = useState<number | null>(null)
  const { modalStatus, setModal } = useMainStore()
  const [pickedCandidate, setPickedCandidate] = useState<TournamentCandidateType | null>(null)
  const [originCandidates, setOriginCandidates] = useState<TournamentCandidateType[]>(post.content.candidates)
  const [status, setStatus] = useState<"init" | "result">("init")
  const isResultPage = status === "result"

  const { rounds } = useMemo(() => getRound(originCandidates.length), [])

  const isImagesLoaded = usePreloadImages(originCandidates.map(({ imageSrc }) => imageSrc))

  useEffect(() => {
    if (isImagesLoaded) {
      setModal("roundSelect")
    }
  }, [isImagesLoaded, setModal])

  const onClickRound = (v: number) => {
    setRound(v)
    setModal("none")
  }

  return isImagesLoaded ? (
    <div className={cx(style["tournament-post"], { [style.result]: isResultPage })}>
      <div className={cx(["tournament-post-inner"])}>
        <PostInfo title={post.title} description={post.description} user={post.user} />
        <div className={cx(style.content, { [style.result]: isResultPage })}>
          {isResultPage && pickedCandidate ? (
            <ResultPart pickedCandidate={pickedCandidate} comments={post.comments} candidates={originCandidates} />
          ) : (
            <div className={cx(style.content, { [style.result]: isResultPage })}>
              {round && (
                <SelectPart
                  setOriginCandidates={setOriginCandidates}
                  setStatus={setStatus}
                  setPickedCandidate={setPickedCandidate}
                  round={round}
                  originCandidates={originCandidates}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {rounds && modalStatus === "roundSelect" && (
        <div className={cx(style["round-select"])}>
          <div className={cx(style.inner)}>
            <h3>라운드를 선택해주세요</h3>
            <ul>
              {rounds.map((v, i) => (
                <li key={`btn_${i}`}>
                  <button onClick={() => onClickRound(v)}>
                    <span>{v}강</span>
                    <i className={cx("fa-solid", "fa-chevron-right")}></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  ) : (
    <FavoriteLoading type="full" text="Image Loading" />
  )
}
