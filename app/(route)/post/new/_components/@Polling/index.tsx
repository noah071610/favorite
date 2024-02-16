"use client"

import ChartPart from "@/(route)/post/polling/_components/Chartpart"
import { useNewPostStore } from "@/_store/newPost"
import { usePollingStore } from "@/_store/newPost/polling"
import classNames from "classnames"
import CandidateList from "./CandidateList"
import SelectPart from "./SelectPart"

export default function PollingContent() {
  const { newPostStatus } = useNewPostStore()
  const { newCandidates } = usePollingStore()

  return (
    <div className={classNames("content", "polling", { isResultPage: newPostStatus === "result" })}>
      <div className="left">
        <CandidateList />
      </div>
      <div className="right">
        {newPostStatus === "edit" && <SelectPart />}
        {newPostStatus === "result" && <ChartPart candidates={newCandidates} isEdit={true} />}
      </div>
    </div>
  )
}
