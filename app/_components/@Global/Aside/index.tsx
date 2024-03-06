"use client"

import { queryKey } from "@/_data"
import { typeSelectors } from "@/_data/post"
import { useMainStore } from "@/_store/main"
import { UserQueryType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const asideSelectors = [
  {
    value: "template",
    link: "/template",
    label: "템플릿",
    children: (
      <>
        <i className={cx("fa-solid", "fa-wand-magic-sparkles", style.symbol)} />
      </>
    ),
  },
  {
    value: "new",
    link: "/post/new",
    label: "만들러가기",
    children: (
      <>
        <i className={cx("fa-solid", "fa-pen", style.symbol)} />
      </>
    ),
  },
  {
    value: "login",
    link: "/login",
    label: "로그인",
    children: (
      <>
        <i className={cx("fa-solid", "fa-user", style.symbol)} />
      </>
    ),
  },
]

export default function Aside() {
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
  })
  const pathname = usePathname()
  const { get } = useSearchParams()
  const query = get("query")
  const asPath = pathname + (query ? `?query=${query}` : "")
  const { modalStatus, setModal } = useMainStore()
  const user = userData?.user

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
              className={cx({ [style.active]: asPath === v.link || (i === 0 && asPath === "/") })}
              onClick={closeModal}
              href={v.link}
              key={v.value}
            >
              <div className={cx(style.icon)}>{v.icon(style)}</div>
              <span className={cx(style.label)}>{v.label}</span>
            </Link>
          )
        })}
        <div className={cx(style.border)}>
          <div></div>
        </div>
        {asideSelectors.map((v) => {
          return v.value === "login" ? (
            user ? (
              <Link
                className={cx({ [style.active]: asPath === v.link })}
                onClick={closeModal}
                href={`/user/${user.userId}`}
                key={"user"}
              >
                <div className={cx(style.icon)}>{v.children}</div>
                <span className={cx(style.label)}>대시보드</span>
              </Link>
            ) : (
              <button className={cx({ [style.active]: asPath === v.link })} onClick={onClickLogin} key={v.value}>
                <div className={cx(style.icon)}>{v.children}</div>
                <span className={cx(style.label)}>{v.label}</span>
              </button>
            )
          ) : (
            <Link
              className={cx({ [style.active]: asPath === v.link })}
              onClick={closeModal}
              href={v.link}
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
