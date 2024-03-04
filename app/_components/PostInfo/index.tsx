"use client"

import { chartBackgroundColors } from "@/_data/chart"
import { UserType } from "@/_types/user"
import classNames from "classNames"
import { InfoInput } from "./Input"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function PostInfo({
  title,
  description,
  user,
  isEdit,
}: {
  title: string
  description: string
  user?: UserType
  isEdit?: boolean
}) {
  return (
    <div className={cx(style.info)}>
      <div className={cx(style.title)}>
        {isEdit ? (
          <InfoInput />
        ) : (
          <>
            <h1>{title}</h1>
            {description.trim() && <h2>{description}</h2>}
          </>
        )}
      </div>
      {!isEdit && user && (
        <div className={cx(style.profile)}>
          <div className={cx(style["user-icon"])}>
            <div style={{ backgroundColor: chartBackgroundColors[1] }} className={cx(style.icon)}>
              <span>{user?.userName.slice(0, 1)}</span>
            </div>
          </div>
          <div className={cx(style["user-info"])}>
            <span>{user?.userName}</span>
            <span>2024/01/13</span>
          </div>
        </div>
      )}
    </div>
  )
}
