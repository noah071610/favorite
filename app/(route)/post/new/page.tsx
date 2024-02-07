"use client"

import "@/(route)/post/[postId]/_components/Candidates/style.scss"
import "@/(route)/post/[postId]/style.scss"
import { getUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { UserType } from "@/_types/post"
import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import { MutableRefObject, useCallback, useEffect, useRef } from "react"
import { useDropzone } from "react-dropzone"
import CreateCandidateModal from "./_components/CreateCandidateModal"
import "./style.scss"

export default function NewPost() {
  const { data: user } = useQuery<UserType>({
    queryKey: ["getUser"],
    queryFn: () => getUser(1),
  })

  const titleRef = useRef<string | null>(null)
  const descriptionRef = useRef<string | null>(null)

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>, type: MutableRefObject<string | null>) => {
    const value = e.target.value
    type.current = value
  }

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const { setModal } = useMainStore()
  const popupCreateCandidateModal = () => {
    setModal("createCandidate")
  }

  useEffect(() => {
    setModal("createCandidate")
  }, [])

  return (
    <div className={classNames("post-wrapper")}>
      <div className="post">
        <div className="post-info">
          <div className="post-info-title">
            <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeInput(e, titleRef)} />
            <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeInput(e, descriptionRef)} />
          </div>
          <div className="post-info-profile">
            <button className="user-image">
              <img src={user?.userImage} alt={`user_image_${user?.userId}`} />
            </button>
            <div>
              <h3>{user?.userName}</h3>
              <span>작성일: 2024/01/13</span>
            </div>
          </div>
        </div>
        <div className={classNames("post-content")}>
          <div className="left">
            <button onClick={popupCreateCandidateModal} className="candidate-create">
              <i className="fa-regular fa-plus" />
            </button>
          </div>
          <div className="right">
            <div className="unselected">
              <div>
                <span>후보 미리보기 창</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateCandidateModal />
    </div>
  )
}
