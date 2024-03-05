"use client"

import { _url, getShareUrl, kakaoShare } from "@/_data"
import { getThumbnail, shareProviders } from "@/_data/post"
import { toastSuccess } from "@/_data/toast"
import { fadeMoveUpAnimation } from "@/_styles/animation"
import { PostCardType } from "@/_types/post/post"
import { copyTextToClipboard } from "@/_utils/copy"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

type ShareProviderValue = "twitter" | "facebook" | "kakaoTalk" | "line" | "link"

export default function ShareModal({
  postCard,
  setOnShareModal,
}: {
  postCard: PostCardType
  setOnShareModal: (b: boolean) => void
}) {
  const onClickShare = async (v: ShareProviderValue) => {
    if (postCard) {
      const { postId, title, type, description, thumbnail: _thumbnail } = postCard
      const thumbnail = getThumbnail(_thumbnail)
      const url = `${_url.client}/post/${type}/${postId}`
      if (v === "link") {
        await copyTextToClipboard(url).then(() => {
          toastSuccess("copyLink")
        })
        return
      }
      if (v === "kakaoTalk") {
        return kakaoShare({
          title,
          description,
          imageUrl: thumbnail.length > 0 ? thumbnail[0] : "// todo: 기본 썸네일",
          link: url,
        })
      }

      window.open(getShareUrl[v]({ text: title, url }), "_blank")
    }
  }

  const onClickOverlay = () => {
    setOnShareModal(false)
  }

  return (
    <div onClick={onClickOverlay} className={cx(style.modal)}>
      <ul>
        {shareProviders.map(({ value }, i) => (
          <li style={fadeMoveUpAnimation(450, i * 80)} key={`share_${value}`}>
            <button onClick={() => onClickShare(value as ShareProviderValue)}>
              <div className={cx(style.image)}>
                <img src={`/images/icon/${value}.png`} alt={value} />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
