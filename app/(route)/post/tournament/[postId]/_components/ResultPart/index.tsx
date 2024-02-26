"use client"

import CommentPart from "@/_components/CommentPart"
import { CommentType } from "@/_types/post/post"
import { TournamentCandidateChartType, TournamentCandidateType } from "@/_types/post/tournament"
import classNames from "classNames"
import { cloneDeep } from "lodash"
import { useMemo, useState } from "react"
import ReactPaginate from "react-paginate"
import Candidate from "./Candidate"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const itemsPerPage = 10

const getTotals = (candidates: TournamentCandidateType[]) => {
  return candidates.reduce(
    (acc, { win, lose, pick }) => {
      acc.win = acc.win + win
      acc.lose = acc.lose + lose
      acc.pick = acc.pick + pick
      return acc
    },
    { win: 0, lose: 0, pick: 0 }
  )
}

const dataArr = [
  { label: "우승 확률", value: "pick" },
  { label: "종합 평가 순위", value: "rating" },
  { label: "매치 승리 확률", value: "win" },
] as const

export default function ResultPart({
  candidates: _candidates,
  pickedCandidate,
  comments,
}: {
  pickedCandidate: TournamentCandidateType
  candidates: TournamentCandidateType[]
  comments: CommentType[]
}) {
  const candidates = _candidates.map((v) => {
    const rating = v.win + v.lose * -0.5 + v.pick * 3
    return {
      ...v,
      rating,
    }
  })
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

  const total = getTotals(candidates)
  const sorted: TournamentCandidateChartType[] = useMemo(() => {
    const target = cloneDeep(candidates)
    switch (sortedStatus.value) {
      case "rating":
        if (sortedStatus.desc) {
          target.sort((a, b) => b.rating - a.rating)
        } else {
          target.sort((a, b) => a.rating - b.rating)
        }
        break
      case "pick":
        if (sortedStatus.desc) {
          target.sort((a, b) => b.pick - a.pick)
        } else {
          target.sort((a, b) => a.pick - b.pick)
        }
        break
      case "win":
        if (sortedStatus.desc) {
          target.sort((a, b) => b.win - a.win)
        } else {
          target.sort((a, b) => a.win - b.win)
        }

        break
      default:
        target.sort((a, b) => b.number - a.number)
        break
    }

    return target.map((v) => {
      const total_match = v.win + v.lose
      return {
        ...v,
        win: ((v.win / total_match) * 100).toFixed(3),
        pick: ((v.pick / total.pick) * 100).toFixed(3),
        lose: ((v.lose / total_match) * 100).toFixed(3),
      }
    })
  }, [sortedStatus])

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
            <span>토너먼트 전체 순위</span>
          </div>
          <div className={cx(style.sort)}>
            {dataArr.map(({ label, value }) => (
              <button
                key={`sort-btn-${value}`}
                onClick={() => onClickSort(value)}
                className={cx({ [style.active]: sortedStatus.value === value })}
              >
                <span className={cx(style.text)}>{label}</span>
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
              index={i}
              candidate={v}
              key={`${v.listId}_${i}`}
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
            <span>코멘트</span>
          </div>
          <div className={cx(style["tournament-comment"])}>
            <CommentPart comments={comments} />
          </div>
        </section>
      </div>
    </div>
  )
}
