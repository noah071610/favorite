"use client"

import ChartPart from "@/(route)/post/[postId]/_components/Chartpart"
import { useNewPostStore } from "@/_store/newPost"
import classNames from "classnames"
import CandidateList from "./CandidateList"
import VotingPart from "./VotingPart"

export default function VoteTypeContent() {
  const { newCandidates, section } = useNewPostStore()

  return (
    <div className={classNames("content", "vote-type", { ["result-page"]: section === "result" })}>
      <div className="left">
        <CandidateList />
      </div>
      <div className="right">
        {section === "edit" && <VotingPart />}
        {section === "result" && <ChartPart candidates={newCandidates} isEdit={true} />}
      </div>
    </div>
  )
}
