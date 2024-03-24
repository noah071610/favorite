"use client"

import Confirm from "@/_components/Confirm"
import { copyPost } from "@/_queries/newPost"
import { useMainStore } from "@/_store/main"
import { PostType } from "@/_types/post"
import { useTranslation } from "@/i18n/client"
import classNames from "classNames"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import TemplateCard from "./TemplateCard"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function TemplatePageContent({ templates }: { templates: PostType[] }) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["posts-page", "post-common"])
  const [targetTemplate, setTargetTemplate] = useState<PostType | null>(null)
  const router = useRouter()
  const { setModal } = useMainStore()
  const { modalStatus } = useMainStore()

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
          <div className={"global-page-title"}>
            <h1>
              <Image width={35} height={35} src="/images/emoji/magic.png" alt="magic" />
              <span>{t("useTemplate")}</span>
            </h1>
          </div>
          <div className={cx(style.grid)}>
            {templates.map((post: PostType) => (
              <TemplateCard
                title={t("candidatePreview", { ns: "post-common" })}
                post={post}
                setTargetTemplate={setTargetTemplate}
                key={`template_${post.postId}`}
              />
            ))}
          </div>
        </div>
      </div>
      {modalStatus === "loadTemplate" && (
        <Confirm title={t("loadTemplate")} onClickConfirm={onClickConfirm} itIsFine={true} />
      )}
    </>
  )
}
