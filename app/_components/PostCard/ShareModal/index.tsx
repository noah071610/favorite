"use client"

import { _url, getShareUrl, kakaoShare } from "@/_data"
import { getThumbnail, noThumbnailUrl, shareProviders } from "@/_data/post"
import { toastSuccess } from "@/_data/toast"
import { PostCardType } from "@/_types/post"
import { copyTextToClipboard } from "@/_utils/copy"
import classNames from "classNames"
import Image from "next/image"

type ShareProviderValue = "twitter" | "facebook" | "kakaoTalk" | "line" | "link"

import { useTranslation } from "@/i18n/client"
import { useParams } from "next/navigation"
export default function ShareModal({
  postCard,
  setOnShareModal,
}: {
  postCard: PostCardType
  setOnShareModal: (b: boolean) => void
}) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["messages"])

  const onClickShare = async (v: ShareProviderValue) => {
    if (postCard) {
      const { postId, title, type, description, thumbnail: _thumbnail } = postCard
      const thumbnail = getThumbnail(_thumbnail)
      const url = `${_url.client}/post/${type}/${postId}`
      if (v === "link") {
        await copyTextToClipboard(url).then(() => {
          toastSuccess(t("success.copyLink"))
        })
        return
      }
      if (v === "kakaoTalk") {
        return kakaoShare({
          title,
          description,
          imageUrl: thumbnail.length > 0 ? thumbnail[0] : noThumbnailUrl,
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
    <div onClick={onClickOverlay} className={classNames("modal")}>
      <ul>
        {shareProviders.map(({ value }, i) => (
          <li style={{ animation: `fade-move-up-little 450ms ${i * 80}ms forwards` }} key={`share_${value}`}>
            <button onClick={() => onClickShare(value as ShareProviderValue)}>
              <div className={classNames("image")}>
                <Image width={22} height={22} src={`/images/icon/${value}.png`} alt={value} />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
