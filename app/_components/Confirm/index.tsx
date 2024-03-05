"use client"

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
  return (
    <div className={"global-confirm"}>
      <div className={"inner"}>
        <h3 dangerouslySetInnerHTML={{ __html: title }}></h3>
        {description && <p>{description}</p>}
        <div className={"btn"}>
          <button onClick={() => onClickConfirm(true)}>
            <span>{customBtn && customBtn?.yes ? customBtn.yes : "네"}</span>
          </button>
          <button onClick={() => onClickConfirm(false)}>
            <span>{customBtn && customBtn?.no ? customBtn.no : "아니요"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
