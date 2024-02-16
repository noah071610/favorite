"use client"

import { ContestContentType } from "@/_types/post/post"
import classNames from "classnames"
import CountUp from "react-countup"

export default function ResultPart({
  content,
  direction,
  ratio,
}: {
  content: ContestContentType
  direction: "left" | "right"
  ratio: string
}) {
  const candidate = content[direction]

  return (
    <div className="contest-candidate contest-result">
      <div className={classNames("image-wrapper")}>
        <div
          style={{
            backgroundImage: `url('${candidate.imageSrc}'), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDEOaqDXtUswwG_M29-z0hIYG-YQqUPBUidpFBHv6g60GgpYq2VQesjbpmVVu8kfd-pw&usqp=CAU')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={classNames("image")}
        />
        <div className="description">
          {/* <div className={`graph-wrapper graph-wrapper-${direction}`}></div> */}

          <div className="title-wrapper">
            <div style={{ width: `calc(${ratio}%)` }} className={`graph graph-${direction}`}>
              <div className="gauge"></div>
            </div>
            <h1 className="title">{candidate?.title}</h1>
            <p className="count">
              <span>
                <CountUp prefix="(" suffix="표)" duration={4} end={candidate.count} />
              </span>
              {" / "}
              <span>
                <CountUp prefix="(" suffix="%)" separator=" " decimals={2} decimal="," end={parseFloat(ratio)} />
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
