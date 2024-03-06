"use client"

import { chartBackgroundColors } from "@/_data/chart"
import { UserType } from "@/_types/user"

export default function PostInfo({
  title,
  description,
  user,
}: {
  title: string
  description: string
  user?: UserType
}) {
  return (
    <div className={"global-post-info"}>
      <div className={"title"}>
        <h1>{title}</h1>
        {description.trim() && <h2>{description}</h2>}
      </div>
      {user && (
        <div className={"profile"}>
          <div className={"user-icon"}>
            <div style={{ backgroundColor: chartBackgroundColors[1] }} className={"icon"}>
              <span>{user?.userName.slice(0, 1)}</span>
            </div>
          </div>
          <div className={"user-info"}>
            <span>{user?.userName}</span>
            <span>2024/01/13</span>
          </div>
        </div>
      )}
    </div>
  )
}
