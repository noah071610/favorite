"use client"

import { queryKey } from "@/_data"
import { typeSelectors } from "@/_data/post"
import { useMainStore } from "@/_store/main"
import { UserQueryType } from "@/_types/user"
import i18n from "@/_utils/i18n"
import { faClose, faPen, faUser, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const asideSelectors = [
  {
    value: "template",
    link: "/template",
    label: "template",
    children: (
      <>
        <FontAwesomeIcon className={cx(style.symbol)} icon={faWandMagicSparkles} />
      </>
    ),
  },
  {
    value: "new",
    link: "/post/new",
    label: "makeNew",
    children: (
      <>
        <FontAwesomeIcon className={cx(style.symbol)} icon={faPen} />
      </>
    ),
  },
  {
    value: "login",
    link: "/login",
    label: "login",
    children: (
      <>
        <FontAwesomeIcon className={cx(style.symbol)} icon={faUser} />
      </>
    ),
  },
]

export default function Aside() {
  const { t, i18n: _i18n } = useTranslation(["nav"])
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user.login,
  })
  const pathname = usePathname()
  const { get } = useSearchParams()
  const query = get("query")
  const asPath = pathname + (query ? `?query=${query}` : "")
  const { modalStatus, setModal } = useMainStore()
  const user = userData?.user

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem("favorite_lang", lang)
    setModal("none")
  }

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
            <FontAwesomeIcon icon={faClose} />
          </div>
        </button>
        <Link onClick={closeModal} href="/">
          <Image width={150} height={30} alt="logo" src="/images/Favorite.png"></Image>
        </Link>
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
              <span className={cx(style.label)}>{t(v.label)}</span>
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
                className={cx({ [style.active]: asPath.includes("/user/") })}
                onClick={closeModal}
                href={`/user/${user.userId}`}
                key={"user"}
              >
                <div className={cx(style.icon)}>{v.children}</div>
                <span className={cx(style.label)}>{t("dashboard")}</span>
              </Link>
            ) : (
              <button className={cx({ [style.active]: asPath === v.link })} onClick={onClickLogin} key={v.value}>
                <div className={cx(style.icon)}>{v.children}</div>
                <span className={cx(style.label)}>{t(v.label)}</span>
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
              <span className={cx(style.label)}>{t(v.label)}</span>
            </Link>
          )
        })}
      </nav>
      <footer className={cx(style.footer)}>
        <ul>
          {["ko", "ja", "en", "th"].map((v) => (
            <li key={v}>
              <button
                className={cx(style.lang, { [style.active]: v === _i18n.language })}
                onClick={() => changeLanguage(v)}
              >
                <Image width={16} height={16} src={`/images/emoji/${v}.png`} alt={`flag_${v}`} />
              </button>
            </li>
          ))}
        </ul>
        <ul>
          {["terms-of-service", "privacy-policy"].map((v) => (
            <li className={cx(style.link)} key={v}>
              <Link href={`/${v}`}>{t(v)}</Link>
            </li>
          ))}
        </ul>
        <span className={cx(style["copy-right"])}>© {dayjs(new Date()).format("YYYY")} Jang Hyunsoo</span>
      </footer>
    </div>
  )
}
