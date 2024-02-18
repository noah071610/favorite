"use client"

import { useMainStore } from "@/_store/main"

import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)
export default function CreateCandidateModal() {
  const { modalStatus } = useMainStore()

  return (
    <div className={cx(style["create-candidate-modal"], { [style.active]: modalStatus === "createCandidate" })}>
      <button className={cx(style.single)}>
        <div className={cx(style.frame)}>
          <i className={cx("fa-regular", "fa-pen-to-square")} />
        </div>
        <span>한 개 생성</span>
      </button>
      <button className={cx(style.multiple)}>
        <div className={cx(style.frame)}>
          <i className={cx("fa-solid", "fa-list")} />
        </div>
        <span>여러 개 생성</span>
      </button>
    </div>
  )
}
