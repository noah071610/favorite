"use client"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import Confirm from "@/_components/Confirm"
import { queryKey } from "@/_data"
import { copyPost } from "@/_queries/newPost"
import { getTemplatePosts } from "@/_queries/posts"
import { useMainStore } from "@/_store/main"
import { LangType } from "@/_types"
import { PostType } from "@/_types/post"
import { useTranslation } from "@/i18n/client"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import TemplateCard from "./_components/TemplateCard"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function TemplatePage() {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["posts-page", "post-common"])
  const [targetTemplate, setTargetTemplate] = useState<PostType | null>(null)
  const router = useRouter()
  const { setModal } = useMainStore()

  const { modalStatus } = useMainStore()
  const { data: templatePosts } = useQuery<PostType[]>({
    queryKey: queryKey.posts["template"],
    queryFn: () => getTemplatePosts(lang as LangType),
  })

  const onClickConfirm = async (isOk: boolean) => {
    if (isOk && targetTemplate) {
      await copyPost(targetTemplate).then((postId: string) => {
        router.push(`/post/edit/${postId}`)
      })
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
                  <span>{t("useTemplate")}</span>
                </h1>
              </div>
              <div className={cx(style.grid)}>
                {templatePosts.map((post: PostType) => (
                  <TemplateCard
                    title={t("candidatePreview", { ns: "post-common" })}
                    post={post}
                    setTargetTemplate={setTargetTemplate}
                    key={`template_${post.postId}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <FavoriteLoading type="full" />
          )}
        </div>
      </div>
      {modalStatus === "loadTemplate" && (
        <Confirm title={t("loadTemplate")} onClickConfirm={onClickConfirm} itIsFine={true} />
      )}
    </>
  )
}
