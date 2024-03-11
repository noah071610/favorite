"use client"

import { TournamentCandidateType, TournamentPostType } from "@/_types/post/tournament"
import { useEffect, useState } from "react"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import Overlay from "@/_components/@Global/Overlay"
import PostInfo from "@/_components/PostInfo"
import { queryKey } from "@/_data"
import { toastSuccess } from "@/_data/toast"
import { useCheckVoted } from "@/_hooks/useCheckVoted"
import { useMainStore } from "@/_store/main"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { useTranslation } from "react-i18next"
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

export default function TournamentPost({ initialPost }: { initialPost: TournamentPostType }) {
  const { t } = useTranslation(["content"])
  const { t: message } = useTranslation(["messages"])
  const { data: post } = useQuery<TournamentPostType>({
    queryKey: queryKey.post(initialPost.postId),
    initialData: initialPost,
  })
  const originCandidates: TournamentCandidateType[] = post.content.candidates

  const [round, setRound] = useState<number | null>(null)
  const { modalStatus, setModal } = useMainStore()
  const [pickedCandidate, setPickedCandidate] = useState<TournamentCandidateType | null>(null)

  const [status, setStatus] = useState<"init" | "result">("init")
  const isResultPage = status === "result"
  const isPreview = post.format === "preview"

  const isVoted = useCheckVoted({
    disable: isPreview,
    candidates: post.content.candidates,
    postId: post.postId,
    resolve: (target) => {
      setStatus("result")
      setPickedCandidate(target)
      toastSuccess(message("success.voted"))
    },
  })

  useEffect(() => {
    if (isPreview || isVoted === false) {
      // null은 기본값임으로 제외
      setModal("roundSelect")
    }
  }, [isPreview, isVoted, setModal])

  const { rounds } = getRound(originCandidates.length)

  const onClickRound = (v: number) => {
    setRound(v)
    setModal("none")
  }

  return (
    <div className={cx(style["tournament-post"], { [style.result]: isResultPage })}>
      <div className={cx(style["tournament-post-inner"])}>
        <PostInfo title={post.title} description={post.description} user={post.user} />
        <div className={cx(style.content, { [style.result]: isResultPage })}>
          {isResultPage && pickedCandidate ? (
            <ResultPart
              authorId={post.user.userId}
              isPreview={isPreview}
              pickedCandidate={pickedCandidate}
              comments={post.comments}
              candidates={originCandidates}
              post={post}
            />
          ) : (
            <>
              {round ? (
                <SelectPart
                  setStatus={setStatus}
                  post={post}
                  setPickedCandidate={setPickedCandidate}
                  round={round}
                  isPreview={isPreview}
                  originCandidates={originCandidates}
                />
              ) : (
                <FavoriteLoading type="content" />
              )}
            </>
          )}
        </div>
      </div>

      {rounds && modalStatus === "roundSelect" && (
        <div className={cx(style["round-select"])}>
          <div className={cx(style.inner)}>
            <h3>{t("selectRound")}</h3>
            <ul>
              {rounds.map((v, i) => (
                <li key={`btn_${i}`}>
                  <button onClick={() => onClickRound(v)}>
                    <span>
                      {v}
                      {t("teams")}
                    </span>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {isPreview && modalStatus === "roundSelect" && <Overlay />}
    </div>
  )
}
