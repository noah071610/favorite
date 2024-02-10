"use client"

import "@/(route)/post/[postId]/_components/Candidate/style.scss"
import "@/(route)/post/[postId]/style.scss"
import { getUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"

import { usePostingStore } from "@/_store/posting"
import { UserType } from "@/_types/post"
import { useQuery } from "@tanstack/react-query"
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import classNames from "classnames"
import { nanoid } from "nanoid"
import { useEffect } from "react"
import Candidate from "../[postId]/_components/Candidate"
import EditCandidate from "./_components/EditCandidate"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(ArcElement)

import { createNewPost } from "@/_queries/post"
import { useRouter } from "next/navigation"
import ChartPart from "../[postId]/_components/Chartpart"
import "./style.scss"

export default function NewPost() {
  const { data: user } = useQuery<UserType>({
    queryKey: ["getUser"],
    queryFn: () => getUser(1),
  })
  const {
    newPost,
    newCandidates,
    addCandidate,
    selectedCandidate,
    setSelectedCandidate,
    setNewCandidates,
    currentPostingPage,
    setNewPost,
    setCurrentPostingPage,
    clearCandidate,
  } = usePostingStore()

  const { setModal } = useMainStore()
  const router = useRouter()

  const popupCreateCandidateModal = () => {
    setModal("createCandidate")
  }

  const createNewCandidate = () => {
    addCandidate({
      listId: nanoid(10),
      title: "",
      count: 0,
      number: newCandidates.length + 1,
      animation: "candidate-add",
    })
  }

  const onChangeInput = (e: any, type: "title" | "description") => {
    setNewPost({ [type]: e.target.value })
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination || typeof destination.index !== "number") return

    setNewCandidates(draggableId, source.index, destination.index)
  }

  const posting = async () => {
    if (!newPost) {
      return alert("에러 발생")
    }
    const { title } = newPost

    if (title.trim().length < 3) return alert("타이틀은 공백을 제외하고 3글자 이상으로 작성해주세요!")
    if (!user) return alert("로그인이 필요해요") //todo: 이건 그래도 로그인 시켜야겠지..?
    if (newCandidates.length < 2) return alert("후보는 적어도 2개 이상 필요해요")
    if (!newCandidates.every(({ title }) => !!title.trim())) return alert("타이틀이 없는 후보가 존재해요")

    const _newCandidates = newCandidates.map(({ animation, ...rest }) => rest)

    await createNewPost({
      ...newPost,
      userId: user.userId,
      info: {
        like: 0,
        participateCount: 0,
        participateImages: [],
        shareCount: 0,
      },
      thumbnail: `https://picsum.photos/id/100/1200/800`, // todo: 썸넬
      content: _newCandidates,
    }).then(() => {
      setSelectedCandidate(null)
      setCurrentPostingPage("init")
      setNewPost(null)
      clearCandidate()
      router.push(`/post/${newPost.postId}`)
    })
  }

  useEffect(() => {
    setNewPost({
      postId: nanoid(10),
      type: "vote",
      title: "",
      description: "",
      chartDescription: "",
      thumbnail: "",
    })
  }, [setNewPost])

  return (
    <div className={classNames("post-wrapper posting-page")}>
      <div className="post">
        {currentPostingPage !== "rending" ? (
          <>
            <div className="post-info">
              <div className="post-info-title">
                {currentPostingPage === "init" && (
                  <>
                    <input
                      className="post-title-input"
                      placeholder="제목 입력"
                      value={newPost?.title ?? ""}
                      onChange={(e) => onChangeInput(e, "title")}
                    />
                    <input
                      className="post-description-input"
                      placeholder="설명 입력"
                      value={newPost?.description ?? ""}
                      onChange={(e) => onChangeInput(e, "description")}
                    />
                  </>
                )}
                {currentPostingPage === "result" && newPost && (
                  <>
                    <h1>{!!newPost.title.trim() ? newPost.title : "제목 입력"}</h1>
                    <p>{!!newPost.description.trim() ? newPost.description : "설명 입력"}</p>
                  </>
                )}
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
                <div
                  style={{ animation: newCandidates.length === 0 ? "none" : "no-candidate-disappear 150ms forwards" }}
                  className="no-candidate"
                >
                  <span>후보가 없어요</span>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="fields">
                    {(provided) => (
                      <ul className="candidate-list">
                        <div className="fields" {...provided.droppableProps} ref={provided.innerRef}>
                          {newCandidates.map((candidate, i) => (
                            <Draggable index={i} key={candidate.listId} draggableId={candidate.listId}>
                              {(draggableProvided) => (
                                <div
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.dragHandleProps}
                                  {...draggableProvided.draggableProps}
                                >
                                  <Candidate
                                    selectedCandidate={selectedCandidate}
                                    setSelectedCandidate={setSelectedCandidate}
                                    candidate={candidate}
                                    index={i}
                                    isResultPage={currentPostingPage === "result"}
                                    isEdit={true}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
                {currentPostingPage === "init" && (
                  <div className="add-candidate-btn">
                    <button onClick={createNewCandidate}>
                      <i className="fa-solid fa-plus" />
                    </button>
                  </div>
                )}
              </div>
              <div className="right">
                {currentPostingPage === "init" ? (
                  selectedCandidate ? (
                    <EditCandidate selectedCandidate={selectedCandidate} />
                  ) : (
                    <div className="unselected">
                      <div>
                        <span>
                          후보 편집창 입니다
                          <br /> 후보를 선택해주세요
                        </span>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="result">
                    {currentPostingPage === "result" && <ChartPart candidates={newCandidates} isEdit={true} />}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="rending">
            <h1>사람들의 생각이 궁금하지 않나요?</h1>
            <p>이제 다 왔어요!🥳</p>
            <div className="btn-wrapper">
              <button>미리 플레이 해보기</button>
              <button onClick={posting}>포스팅 하기</button>
            </div>
          </div>
        )}
      </div>
      {/* <CreateCandidateModal /> */}
    </div>
  )
}
