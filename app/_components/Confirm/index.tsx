"use client"

import { useTranslation } from "@/i18n/client"
import { useParams } from "next/navigation"
export default function Confirm({
  title,
  description,
  onClickConfirm,
  itIsFine,
}: {
  title: string
  description?: string
  onClickConfirm: (isOk: boolean) => void
  itIsFine?: boolean
}) {
  const { lang } = useParams()
  const { t } = useTranslation(lang)
  return (
    <div className={"global-confirm"}>
      <div className={"inner"}>
        <h3 dangerouslySetInnerHTML={{ __html: title }}></h3>
        {description && <p>{description}</p>}
        <div className={"btn"}>
          <button onClick={() => onClickConfirm(true)}>
            <span>{itIsFine ? t("itIsFine") : t("yes")}</span>
          </button>
          <button onClick={() => onClickConfirm(false)}>
            <span>{itIsFine ? t("cancel") : t("no")}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
