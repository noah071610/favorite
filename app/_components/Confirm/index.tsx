"use client"

import { useTranslation } from "react-i18next"
export default function Confirm({
  title,
  description,
  onClickConfirm,
  customBtn,
}: {
  title: string
  description?: string
  onClickConfirm: (isOk: boolean) => void
  customBtn?: {
    yes?: string
    no?: string
  }
}) {
  const { t } = useTranslation(["common"])
  return (
    <div className={"global-confirm"}>
      <div className={"inner"}>
        <h3 dangerouslySetInnerHTML={{ __html: title }}></h3>
        {description && <p>{description}</p>}
        <div className={"btn"}>
          <button onClick={() => onClickConfirm(true)}>
            <span>{customBtn && customBtn?.yes ? customBtn.yes : t("yes")}</span>
          </button>
          <button onClick={() => onClickConfirm(false)}>
            <span>{customBtn && customBtn?.no ? customBtn.no : t("no")}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
