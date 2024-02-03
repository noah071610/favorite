"use client"

import { useMainStore } from "@/_store"
import classNames from "classnames"
import "./style.scss"

export default function SearchModal() {
  const { modalStatus } = useMainStore()
  return (
    <div className={classNames("search-modal", { active: modalStatus === "search" })}>
      <div className="search-modal-content"></div>
    </div>
  )
}
