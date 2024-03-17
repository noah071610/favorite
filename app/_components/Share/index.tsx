"use client"

import { _url, getShareUrl, kakaoShare, queryKey } from "@/_data"
import { getThumbnail, noThumbnailUrl, shareProviders } from "@/_data/post"
import { toastSuccess } from "@/_data/toast"
import { useMainStore } from "@/_store/main"
import { UserQueryType } from "@/_types/user"
import { copyTextToClipboard } from "@/_utils/copy"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

type ShareProviderValue = "twitter" | "facebook" | "kakaoTalk" | "line" | "link"

export default function Share({ post }: { post: any }) {
  const { t } = useTranslation(["content", "messages"])
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user.login,
  })
  const user = userData?.user
  const { push } = useRouter()
  const { setModal, modalStatus } = useMainStore()
  const onClickShare = async (v: ShareProviderValue) => {
    if (post) {
      const { postId, title, type, description, thumbnail: _thumbnail } = post
      const thumbnail = getThumbnail(_thumbnail)
      const url = `${_url.client}/post/${type}/${postId}`
      if (v === "link") {
        await copyTextToClipboard(url).then(() => {
          toastSuccess(t("success.copyLink", { ns: "messages" }))
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

  const onClickLogin = () => {
    if (user) {
      push(`/user/${user.userId}`)
    } else {
      setModal("loginInContent")
    }
  }

  useEffect(() => {
    if (modalStatus === "loginInContentSuccess") {
      toastSuccess(t("success.login", { ns: "messages" }))
      if (user) {
        setModal("none")
        push(`/user/${user.userId}`)
      } else {
        setModal("none")
      }
    }
  }, [modalStatus, user])

  return (
    <section className={cx(style["cta-section"])}>
      <div className={cx(style["cta-wrapper"])}>
        <div className={cx(style["cta-main"])}>
          <ul>
            {shareProviders.map(({ value }, i) => (
              <li key={`share_${value}`}>
                <button onClick={() => onClickShare(value as ShareProviderValue)}>
                  <div className={cx(style.image)}>
                    <Image width={22} height={22} src={`/images/icon/${value}.png`} alt={value} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className={cx(style.cta)}>
            <Link href="/">
              <span>{t("lookContents")}</span>
              <Image src="/images/emoji/dizzy.png" width={22} height={22} alt="icon-1" />
            </Link>
            <button onClick={onClickLogin}>
              <span>{t("makeNew")}</span>
              <Image src="/images/emoji/rocket.png" width={22} height={22} alt="icon-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
