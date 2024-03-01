"use client"

import { useMainStore } from "@/_store/main"
import classNames from "classNames"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const typeSelectors = [
  {
    value: "/?query=all",
    label: "모두 보기",
    children: (
      <>
        <i className={cx("fa-solid", "fa-list", style.symbol)} />
      </>
    ),
  },
  {
    value: "/?query=polling",
    label: "투표",
    children: (
      <>
        <i className={cx("fa-solid", "fa-chart-simple", style.symbol)} />
      </>
    ),
  },
  {
    value: "/?query=contest",
    label: "1:1 대결",
    children: (
      <>
        <span className={cx(style.symbol, style.contest)}>VS</span>
      </>
    ),
  },
  {
    value: "/?query=tournament",
    label: "토너먼트",
    children: (
      <>
        <i className={cx("fa-solid", "fa-trophy")} />
      </>
    ),
  },
]

const asideSelectors = [
  {
    value: "/template",
    label: "템플릿",
    children: (
      <>
        <i className={cx("fa-solid", "fa-wand-magic-sparkles", style.symbol)} />
      </>
    ),
  },
  {
    value: "/post/new",
    label: "만들러가기",
    children: (
      <>
        <i className={cx("fa-solid", "fa-pen", style.symbol)} />
      </>
    ),
  },
  {
    value: "/login",
    label: "로그인",
    children: (
      <>
        <i className={cx("fa-solid", "fa-user", style.symbol)} />
      </>
    ),
  },
]

export default function Aside() {
  const pathname = usePathname()
  const { get } = useSearchParams()
  const query = get("query")
  const asPath = pathname + (query ? `?query=${query}` : "")
  const { modalStatus, setModal } = useMainStore()

  const closeModal = () => {
    setModal("none")
  }
  const onClickLogin = () => {
    setModal("login")
  }

  return (
    <div className={cx(style.aside, { [style.open]: modalStatus === "aside" })}>
      <div className={cx(style.top)}>
        <button onClick={closeModal}>
          <div className={cx(style.icon)}>
            <i className={cx("fa-solid", "fa-close")}></i>
          </div>
        </button>
      </div>
      <nav className={cx(style.inner)}>
        {typeSelectors.map((v, i) => {
          return (
            <Link
              className={cx({ [style.active]: asPath === v.value || (i === 0 && asPath === "/") })}
              onClick={closeModal}
              href={v.value}
              key={v.value}
            >
              <div className={cx(style.icon)}>{v.children}</div>
              <span className={cx(style.label)}>{v.label}</span>
            </Link>
          )
        })}
        <div className={cx(style.border)}>
          <div></div>
        </div>
        {asideSelectors.map((v) => {
          return v.value === "/login" ? (
            <button className={cx({ [style.active]: asPath === v.value })} onClick={onClickLogin} key={v.value}>
              <div className={cx(style.icon)}>{v.children}</div>
              <span className={cx(style.label)}>{v.label}</span>
            </button>
          ) : (
            <Link
              className={cx({ [style.active]: asPath === v.value })}
              onClick={closeModal}
              href={v.value}
              key={v.value}
            >
              <div className={cx(style.icon)}>{v.children}</div>
              <span className={cx(style.label)}>{v.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
