"use client"

import CommentPart from "@/_components/CommentPart"
import Share from "@/_components/Share"
import { CommentType } from "@/_types/post/post"
import { TournamentCandidateChartType, TournamentCandidateType, TournamentPostType } from "@/_types/post/tournament"
import classNames from "classNames"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import ReactPaginate from "react-paginate"
import Candidate from "./Candidate"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const itemsPerPage = 10

const getTotals = (candidates: TournamentCandidateType[]) => {
  return candidates.reduce(
    (acc, { win, lose, pick }) => {
      acc.win += win
      acc.lose += lose
      acc.pick += pick
      return acc
    },
    { win: 0, lose: 0, pick: 0 }
  )
}

const getSelectedCandidateData = (targetNum: number, candidates: TournamentCandidateChartType[]) => {
  const pickRank = candidates.toSorted((a, b) => b.pick - a.pick).findIndex(({ number }) => number === targetNum) + 1
  const winRank = candidates.toSorted((a, b) => b.win - a.win).findIndex(({ number }) => number === targetNum) + 1
  const ratingRank =
    candidates.toSorted((a, b) => b.rating - a.rating).findIndex(({ number }) => number === targetNum) + 1
  return {
    pickRank,
    winRank,
    ratingRank,
  }
}

export const dataArr = [
  { label: "info.pickPercent", value: "pick" },
  { label: "info.ratingRank", value: "rating" },
  { label: "info.winPercent", value: "win" },
] as const

export default function ResultPart({
  candidates: _candidates,
  pickedCandidate,
  comments,
  isPreview,
  authorId,
  post,
}: {
  pickedCandidate: TournamentCandidateType
  candidates: TournamentCandidateType[]
  comments: CommentType[]
  isPreview: boolean
  authorId: number
  post: TournamentPostType
}) {
  const { t } = useTranslation(["content"])
  const total = getTotals(_candidates)
  const candidates = _candidates.map((v) => {
    const rating = v.win + v.lose * -0.5 + v.pick * 3
    const total_match = v.win + v.lose
    return {
      ...v,
      rating,
      winPercent: ((v.win / total_match) * 100).toFixed(3),
      pickPercent: ((v.pick / total.pick) * 100).toFixed(3),
      losePercent: ((v.lose / total_match) * 100).toFixed(3),
    }
  }) // memo: total ,candidates uniqueData의 순서 변경을 하지 말아야 함
  const uniqueData = getSelectedCandidateData(pickedCandidate.number, candidates)

  const [sortedStatus, setSortedStatus] = useState<{
    value: "pick" | "rating" | "win"
    desc: boolean
  }>({ value: "pick", desc: true })
  const [itemOffset, setItemOffset] = useState(0)
  const [page, setPage] = useState(0)

  const endOffset = itemOffset + itemsPerPage
  const pageCount = Math.ceil(candidates.length / itemsPerPage)

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % candidates.length
    setItemOffset(newOffset)
    setPage(event.selected)
    if (typeof window === "object") {
      window.scrollTo({
        top: 0,
      })
    }
  }

  const sorted: TournamentCandidateChartType[] = useMemo(() => {
    let target
    switch (sortedStatus.value) {
      case "rating":
        if (sortedStatus.desc) {
          target = candidates.toSorted((a, b) => b.rating - a.rating)
        } else {
          target = candidates.toSorted((a, b) => a.rating - b.rating)
        }
        break
      case "pick":
        if (sortedStatus.desc) {
          target = candidates.toSorted((a, b) => b.pick - a.pick)
        } else {
          target = candidates.toSorted((a, b) => a.pick - b.pick)
        }
        break
      case "win":
        if (sortedStatus.desc) {
          target = candidates.toSorted((a, b) => b.win - a.win)
        } else {
          target = candidates.toSorted((a, b) => b.lose - a.lose)
        }

        break
      default:
        target = candidates.toSorted((a, b) => b.number - a.number)
        break
    }

    return target
  }, [candidates, sortedStatus])

  const onClickSort = (value: "pick" | "win" | "rating") => {
    setSortedStatus((obj) => ({ value, desc: obj.value === value ? !obj.desc : true }))
    setItemOffset(0)
    setPage(0)
  }

  return (
    <div className={cx(style.result)}>
      <div className={cx(style["result-inner"])}>
        <section className={cx(style["section"])}>
          <div className={cx(style.title)}>
            <div className={cx(style.icon)}>
              <i className={cx("fa-solid", "fa-chart-simple")} />
            </div>
            <span>{t("mySelection")}</span>
          </div>
          <Candidate
            selected={true}
            uniqueData={uniqueData}
            candidateLength={candidates.length}
            candidate={candidates.find(({ number }) => pickedCandidate.number === number)!} // memo: 이건 확실하다.. 정말로
          />
        </section>
        <section className={cx(style["section"])}>
          <div className={cx(style.title)}>
            <div className={cx(style.icon)}>
              <i className={cx("fa-solid", "fa-chart-simple")} />
            </div>
            <span>{t("allRank")}</span>
          </div>
          <div className={cx(style.sort)}>
            {dataArr.map(({ label, value }) => (
              <button
                key={`sort-btn-${value}`}
                onClick={() => onClickSort(value)}
                className={cx({ [style.active]: sortedStatus.value === value })}
              >
                <span className={cx(style.text)}>{t(label)}</span>
                <i
                  className={cx("fa-solid", "fa-chevron-up", {
                    [style.asc]: sortedStatus.value === value && !sortedStatus.desc,
                  })}
                ></i>
              </button>
            ))}
          </div>
          {sorted.slice(itemOffset, endOffset).map((v, i) => (
            <Candidate
              selected={pickedCandidate.listId === v.listId}
              candidate={v}
              key={`${v.listId}_${i}_${sortedStatus.value}`}
            />
          ))}
          <ReactPaginate
            breakLabel="..."
            nextLabel={">"}
            onPageChange={handlePageClick}
            forcePage={page}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            className={cx(style.paginate)}
            activeClassName={cx(style.active)}
            disabledClassName={cx(style.disabled)}
          />
        </section>
        <section className={cx(style["section"])}>
          <div className={cx(style.title)}>
            <div className={cx(style.icon)}>
              <i className={cx("fa-solid", "fa-comment")} />
            </div>
            <span>{t("comment")}</span>
          </div>
          <div className={cx(style["tournament-comment"])}>
            <CommentPart isPreview={isPreview} authorId={authorId} comments={comments} />
          </div>
        </section>
        {!isPreview && <Share post={post} />}
      </div>
    </div>
  )
}
