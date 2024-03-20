"use client"

import { queryKey } from "@/_data"
import { typeSelectors } from "@/_data/post"
import { getUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { UserQueryType } from "@/_types/user"
import { useTranslation } from "@/i18n/client"
import { faClose, faPen, faUser, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
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
  const { lang } = useParams()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const { t, i18n } = useTranslation(lang, "nav")
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
    queryFn: getUser,
  })
  const pathname = usePathname()
  const { modalStatus, setModal } = useMainStore()
  const user = userData?.user

  const changeLanguage = (lang: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const search = current.toString()
    const query = search ? `?${search}` : ""

    replace(`/${lang}/${pathname.split("/").slice(2).join("/")}${query}`)
    i18n.changeLanguage(lang)
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
              className={cx({ [style.active]: pathname.includes(v.value) || (i === 0 && pathname === `/${lang}`) })}
              onClick={closeModal}
              href={`${v.link}`}
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
          switch (true) {
            case v.value === "login":
              if (user) {
                return (
                  <Link
                    className={cx({ [style.active]: pathname.includes("/user/") })}
                    onClick={closeModal}
                    href={`/user/${user.userId}`}
                    key={"user"}
                  >
                    <div className={cx(style.icon)}>{v.children}</div>
                    <span className={cx(style.label)}>{v.value === "login" ? t("dashboard") : t(v.label)}</span>
                  </Link>
                )
              } else {
                return (
                  <button className={cx({ [style.active]: pathname === v.link })} onClick={onClickLogin} key={v.value}>
                    <div className={cx(style.icon)}>{v.children}</div>
                    <span className={cx(style.label)}>{t(v.label)}</span>
                  </button>
                )
              }
            case v.value === "new":
              if (user) {
                return <div key={v.value}></div>
              } else {
                return (
                  <button className={cx({ [style.active]: pathname === v.link })} onClick={onClickLogin} key={v.value}>
                    <div className={cx(style.icon)}>{v.children}</div>
                    <span className={cx(style.label)}>{t(v.label)}</span>
                  </button>
                )
              }
            default:
              return (
                <Link
                  className={cx({ [style.active]: pathname === v.link })}
                  onClick={closeModal}
                  href={v.link}
                  key={v.value}
                >
                  <div className={cx(style.icon)}>{v.children}</div>
                  <span className={cx(style.label)}>{t(v.label)}</span>
                </Link>
              )
          }
        })}
      </nav>
      <footer className={cx(style.footer)}>
        <ul>
          {["ko", "ja", "en", "th"].map((v) => (
            <li key={v}>
              <button className={cx(style.lang, { [style.active]: v === lang })} onClick={() => changeLanguage(v)}>
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
