"use client"

import LoadingBar from "@/_components/@Global/Loading/LoadingBar"
import { getImageUrl } from "@/_data"
import { useProgressiveImage } from "@/_hooks/useProgressiveImage"
import { TournamentCandidateChartType } from "@/_types/post/tournament"
import classNames from "classNames"
import { useEffect, useRef, useState } from "react"
import Info from "./Info"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const dataArr = [
  { label: "info.pickPercent", value: "pickPercent" },
  { label: "info.winPercent", value: "winPercent" },
  { label: "info.losePercent", value: "losePercent" },
] as const

export default function Candidate({
  selected,
  candidate,
  uniqueData,
  candidateLength,
}: {
  selected: boolean
  candidate: TournamentCandidateChartType
  uniqueData?: {
    pickRank: number
    winRank: number
    ratingRank: number
  }
  candidateLength?: number
}) {
  const imageStatus = useProgressiveImage(candidate.imageSrc)
  const ref = useRef<HTMLDivElement | null>()
  const [isIntersecting, setIntersecting] = useState(false)
  const [isDisplayed, setIsDisplayed] = useState(false)

  useEffect(() => {
    if (!isDisplayed) {
      const observer = new IntersectionObserver(([entry]) => {
        setIntersecting(entry.isIntersecting)
      })

      const currentRef = ref.current

      if (currentRef) {
        if (isIntersecting) {
          setIntersecting(true)
          setIsDisplayed(true)
          observer.unobserve(currentRef)
        } else {
          observer.observe(currentRef)
        }
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef)
        }
      }
    }
  }, [ref?.current, isIntersecting, isDisplayed])

  return (
    <li ref={ref as any} className={cx(style.candidate, { [style.selected]: selected })}>
      <div className={cx(style.top)}>
        <div className={cx(style.left)}>
          {imageStatus === "success" && (
            <div
              style={{
                backgroundImage: getImageUrl({ url: candidate.imageSrc }),
              }}
              className={cx(style.image)}
            />
          )}
          {imageStatus === "loading" && (
            <div className={cx(style.loading)}>
              <LoadingBar />
            </div>
          )}
        </div>
        <div className={cx(style.right)}>
          <div className={cx(style.title)}>
            <h1>{candidate.title}</h1>
          </div>
          <div className={cx(style.content)}>
            <div className={cx(style.chart)}>
              {dataArr.map(({ value }) => (
                <div key={`${candidate.listId}_${value}`} className={cx(style["gauge-outer"], style[value])}>
                  <div style={{ width: `${candidate[value]}%` }} className={cx(style["gauge-inner"])}>
                    <div
                      style={{
                        animation: isIntersecting ? `${style.move} 700ms cubic-bezier(0, 0.97, 1, 1.01) forwards` : "",
                      }}
                      className={cx(style["gauge"])}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="global-pc-visible">
              <Info
                isIntersecting={isIntersecting}
                uniqueData={uniqueData}
                candidateLength={candidateLength}
                index={0}
                candidate={candidate}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="global-mobile-visible">
        <Info
          isIntersecting={isIntersecting}
          uniqueData={uniqueData}
          candidateLength={candidateLength}
          index={0}
          candidate={candidate}
        />
      </div>
    </li>
  )
}
