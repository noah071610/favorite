"use client"

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
  user: UserType
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
      <div className={cx(style.profile)}>
        <button className={cx(style["user-image"])}>
          <img src={user.userImage} alt={`user_image_${user.userId}`} />
        </button>
        <div className={cx(style["user-info"])}>
          <span>{user.userName}</span>
          <span>2024/01/13</span>
        </div>
      </div>
    </div>
  )
}
