"use client"

import { useModalStore } from "@/_store"
import classNames from "classnames"
import "./style.scss"

export default function SearchModal() {
  const { modalStatus } = useModalStore()
  return (
    <div className={classNames("search-modal", { active: modalStatus === "search" })}>
      <div className="search-modal-content"></div>
    </div>
  )
}
