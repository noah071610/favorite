"use client"

import { TournamentCandidateType, TournamentPostType } from "@/_types/post/tournament"
import { useEffect, useState } from "react"

import PostInfo from "@/_components/PostInfo"
import { successMessage } from "@/_data/message"
import { successToastOptions } from "@/_data/toast"
import { useCheckVoted } from "@/_hooks/useCheckVoted"
import { useMainStore } from "@/_store/main"
import classNames from "classNames"
import { toast } from "react-toastify"
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
  const [post, setPost] = useState<TournamentPostType>(initialPost)
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
      toast.success(successMessage["voted"], successToastOptions("voted"))
    },
  })

  useEffect(() => {
    if (isVoted === false) {
      // null은 기본값임으로 제외
      setModal("roundSelect")
    }
  }, [isVoted, setModal])

  const { rounds } = getRound(originCandidates.length)

  const onClickRound = (v: number) => {
    setRound(v)
    setModal("none")
  }

  return (
    <div className={cx(style["tournament-post"], { [style.result]: isResultPage })}>
      <div className={cx(["tournament-post-inner"])}>
        <PostInfo title={post.title} description={post.description} user={post.user} />
        <div className={cx(style.content, { [style.result]: isResultPage })}>
          {isResultPage && pickedCandidate ? (
            <ResultPart
              authorId={post.user.userId}
              isPreview={isPreview}
              pickedCandidate={pickedCandidate}
              comments={post.comments}
              setPost={setPost}
              candidates={originCandidates}
            />
          ) : (
            <>
              {round ? (
                <SelectPart
                  setPost={setPost}
                  setStatus={setStatus}
                  post={post}
                  setPickedCandidate={setPickedCandidate}
                  round={round}
                  isPreview={isPreview}
                  originCandidates={originCandidates}
                />
              ) : (
                <div className={cx(style.loading)}>
                  <i className={cx("fa-solid", "fa-gift")} />
                  <i className={cx("fa-solid", "fa-heart")} />
                  <i className={cx("fa-solid", "fa-rocket")} />
                </div>
              )}
            </>
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
  )
}
