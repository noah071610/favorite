"use client"

import { queryKey } from "@/_data"
import { typeSelectors } from "@/_data/post"
import { getUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { LangType } from "@/_types"
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
import { Suspense } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

function LanguageComponent({ lang }: { lang: LangType }) {
  const { replace } = useRouter()
  const { i18n } = useTranslation(lang, "nav")
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { setModal } = useMainStore()

  const changeLanguage = (lang: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const search = current.toString()
    const query = search ? `?${search}` : ""

    replace(`/${lang}/${pathname.split("/").slice(2).join("/")}${query}`)
    i18n.changeLanguage(lang)
    setModal("none")
  }

  return (
    <ul>
      {["ko", "ja", "en", "th"].map((v) => (
        <li key={v}>
          <button className={cx(style.lang, { [style.active]: v === lang })} onClick={() => changeLanguage(v)}>
            <Image width={16} height={16} src={`/images/emoji/${v}.png`} alt={`flag_${v}`} />
          </button>
        </li>
      ))}
    </ul>
  )
}

export default function Aside() {
  const { lang } = useParams()
  const { t } = useTranslation(lang, "nav")
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
    queryFn: getUser,
  })
  const pathname = usePathname()
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
            <FontAwesomeIcon icon={faClose} />
          </div>
        </button>
        <Link onClick={closeModal} href="/">
          <Image width={150} height={30} priority={true} alt="logo" src="/images/favorite.png"></Image>
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
        {/* TEMPLATE */}
        <Link className={cx({ [style.active]: pathname.includes("template") })} onClick={closeModal} href={"/template"}>
          <div className={cx(style.icon)}>
            <FontAwesomeIcon className={cx(style.symbol)} icon={faWandMagicSparkles} />
          </div>
          <span className={cx(style.label)}>{t("template")}</span>
        </Link>
        {!user && (
          <button onClick={onClickLogin}>
            <div className={cx(style.icon)}>
              <FontAwesomeIcon className={cx(style.symbol)} icon={faPen} />
            </div>
            <span className={cx(style.label)}>{t("makeNew")}</span>
          </button>
        )}

        {/* LOGIN */}
        {user ? (
          <Link
            className={cx({ [style.active]: pathname.includes("/user/") })}
            onClick={closeModal}
            href={`/user/${user.userId}`}
          >
            <div className={cx(style.icon)}>
              <FontAwesomeIcon className={cx(style.symbol)} icon={faUser} />
            </div>
            <span className={cx(style.label)}>{t("dashboard")}</span>
          </Link>
        ) : (
          <button onClick={onClickLogin}>
            <div className={cx(style.icon)}>
              <FontAwesomeIcon className={cx(style.symbol)} icon={faUser} />
            </div>
            <span className={cx(style.label)}>{t("login")}</span>
          </button>
        )}
      </nav>
      <footer className={cx(style.footer)}>
        <Suspense>
          <LanguageComponent lang={lang as LangType} />
        </Suspense>
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
