"use client"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import Confirm from "@/_components/Confirm"
import { queryKey } from "@/_data"
import { getTemplatePosts } from "@/_queries/post"
import { useMainStore } from "@/_store/main"
import { useNewPostStore } from "@/_store/newPost"
import { TemplatePostCardType, ThumbnailType } from "@/_types/post/post"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { nanoid } from "nanoid"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import TemplateCard from "./_components/TemplateCard"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function TemplatePage() {
  const { t } = useTranslation(["title", "modal"])
  const [targetTemplate, setTargetTemplate] = useState<TemplatePostCardType | null>(null)
  const router = useRouter()
  const { setModal } = useMainStore()
  const { loadNewPost } = useNewPostStore()

  const { modalStatus } = useMainStore()
  const { data: templatePosts } = useQuery<TemplatePostCardType[]>({
    queryKey: queryKey.home["template"],
    queryFn: getTemplatePosts,
  })

  const onClickConfirm = (isOk: boolean) => {
    if (isOk && targetTemplate) {
      const {
        content: { candidates, ...newContent },
        ...newPost
      } = targetTemplate
      const { popular, lastPlayedAt, createdAt, ...restNewPost } = newPost

      localStorage.removeItem("favorite_save_data")
      const thumbnailArr = targetTemplate.thumbnail.split("${}$")
      const thumbnailType: ThumbnailType =
        thumbnailArr.length > 1 ? "layout" : targetTemplate.thumbnail.trim() ? "custom" : "none"
      loadNewPost({
        newPost: {
          ...restNewPost,
          postId: nanoid(10),
          count: 0,
          format: "default",
        },
        candidates:
          newPost.type === "tournament"
            ? candidates.map((v) => ({
                ...v,
                pick: 0,
                win: 0,
                lose: 0,
              }))
            : candidates.map((v) => ({
                ...v,
                pick: 0,
              })),
        content: newContent,
        selectedCandidateIndex: -1,
        newPostStatus: "edit",
        thumbnail: {
          imageSrc: thumbnailType === "custom" ? targetTemplate.thumbnail : "",
          isPossibleLayout: false,
          layout: thumbnailType === "layout" ? thumbnailArr : [],
          slice: thumbnailType === "layout" ? thumbnailArr.length : candidates.length > 5 ? 5 : candidates.length,
          type: thumbnailType,
        },
      })
      router.push("/post/new?from=template")
    }
    setModal("none")
  }

  return (
    <>
      <div className={"global-page"}>
        <div className={cx("global-page-content", style.content)}>
          {templatePosts ? (
            <>
              <div className={"global-page-title"}>
                <h1>
                  <Image width={35} height={35} src="/images/emoji/magic.png" alt="magic" />
                  <span>{t("useTemplate", { ns: "title" })}</span>
                </h1>
              </div>
              <div className={cx(style.grid)}>
                {templatePosts.map((post: TemplatePostCardType) => (
                  <TemplateCard post={post} setTargetTemplate={setTargetTemplate} key={`template_${post.postId}`} />
                ))}
              </div>
            </>
          ) : (
            <FavoriteLoading type="full" />
          )}
        </div>
      </div>
      {modalStatus === "loadTemplate" && (
        <Confirm
          title={t("loadTemplate", { ns: "modal" })}
          onClickConfirm={onClickConfirm}
          customBtn={{ yes: t("itIsFine", { ns: "modal" }), no: t("cancel", { ns: "modal" }) }}
        />
      )}
    </>
  )
}
