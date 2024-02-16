"use client"

import { ContestContentType } from "@/_types/post/post"
import classNames from "classnames"

export default function SelectPart({
  content,
  direction,
}: {
  content: ContestContentType
  direction: "left" | "right"
}) {
  const candidate = content[direction]

  return (
    <>
      <div className="contest-candidate">
        <div
          style={{
            background: `url('${candidate.imageSrc}') center / cover`,
          }}
          className={classNames("thumbnail")}
        ></div>
        <div className="description">
          <div className="title-wrapper">
            <h1 className="title">{candidate?.title}</h1>
          </div>
        </div>
      </div>
    </>
  )
}
