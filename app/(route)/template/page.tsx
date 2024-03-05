"use client"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import PostCard from "@/_components/PostCard"
import { queryKey } from "@/_data"
import { getTemplatePosts } from "@/_queries/post"
import { PollingCandidateType } from "@/_types/post/polling"
import { TemplatePostCardType } from "@/_types/post/post"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import Candidate from "../post/polling/[postId]/_components/Candidate"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function TemplatePage() {
  const { data: templatePosts } = useQuery<TemplatePostCardType[]>({
    queryKey: queryKey.home["template"],
    queryFn: getTemplatePosts,
  })

  return (
    <>
      <div className={"global-page"}>
        <div className={"content"}>
          {templatePosts ? (
            <>
              <div className={"title"}>
                <h1>
                  <img src="/images/emoji/magic.png" />
                  <span>템플릿으로 빠른 시작</span>
                </h1>
              </div>
              <div className={cx(style.grid)}>
                {templatePosts.map((v: TemplatePostCardType) => {
                  const { content, ...rest } = v
                  return (
                    <div className={cx(style["template-card"])} key={`template_${v.postId}`}>
                      <PostCard postCard={rest} isTemplate={true} />
                      <div className={cx(style["candidates"])}>
                        <h2>후보 미리보기</h2>
                        <div className={cx(style["candidates-inner"])}>
                          {content.candidates.map((v, i) => (
                            <Candidate
                              candidate={v as PollingCandidateType}
                              onClickCandidate={() => {}}
                              index={i}
                              isResultPage={false}
                              isSelected={false}
                              layout="textImage"
                            />
                            // <li key={`${rest.postId}_candidate_${i}`}>
                            //   <div className={cx(style["candidate-left"])}>
                            //     <div style={{ background: getImageUrl({ url: imageSrc, isCenter: true }) }}></div>
                            //   </div>
                            //   <div className={cx(style["candidate-right"])}>
                            //     <h4>{title}</h4>
                            //     <p>{description}</p>
                            //   </div>
                            // </li>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <FavoriteLoading type="full" />
          )}
        </div>
      </div>
    </>
  )
}
