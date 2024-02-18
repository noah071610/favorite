"use client"

import ChartPart from "@/(route)/post/polling/[postId]/_components/ChartPart"
import { useNewPostStore } from "@/_store/newPost"
import { usePollingStore } from "@/_store/newPost/polling"
import CandidateList from "./CandidateList"
import SelectPart from "./SelectPart"

import style from "@/(route)/post/contest/[postId]/style.module.scss"
import classNames from "classNames"
const cx = classNames.bind(style)

export default function PollingContent() {
  const { newPostStatus } = useNewPostStore()
  const { newCandidates } = usePollingStore()

  return (
    <div className={cx(style.content, style.polling, { isResultPage: newPostStatus === "result" })}>
      <div className={cx(style.left)}>
        <CandidateList />
      </div>
      <div className={cx(style.right)}>
        {newPostStatus === "edit" && <SelectPart />}
        {newPostStatus === "result" && <ChartPart candidates={newCandidates} isEdit={true} />}
      </div>
    </div>
  )
}
