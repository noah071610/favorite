"use client"

import { useNewPostStore } from "@/_store/newPost"
import TextareaAutosize from "react-textarea-autosize"

import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"

import { nanoid } from "nanoid"

import { PollingCandidateType } from "@/_types/post/polling"
import { ContentLayoutType } from "@/_types/post/post"
import classNames from "classNames"
import { useCallback, useEffect, useState } from "react"
import Candidate from "./Candidate"
import SelectPart from "./SelectPart"
import style from "./style.module.scss"

const selectorTypes = [
  { value: "textImage", icons: ["fa-heading", "fa-plus", "fa-image"], label: "이미지와 텍스트" },
  { value: "image", icons: ["fa-image"], label: "이미지 중심" },
  { value: "text", icons: ["fa-heading"], label: "텍스트만" },
]

const cx = classNames.bind(style)

const ChartDescription = () => {
  const {
    content: { resultDescription },
    setContent,
  } = useNewPostStore()
  const onChangeDescription = (e: any) => {
    setContent({ type: "resultDescription", payload: e.target.value })
  }
  return (
    <section className={cx("styler-section")}>
      <h1>결과 페이지 설명</h1>
      <TextareaAutosize
        placeholder="투표 결과 설명 입력 (옵션)"
        className={cx(style["description-input"])}
        value={resultDescription ?? ""}
        onChange={onChangeDescription}
        maxLength={180}
      />
    </section>
  )
}

export default function PollingContent() {
  const {
    newPost,
    content,
    candidates,
    moveCandidate,
    setContent,
    setSelectedCandidateIndex,
    addCandidate,
    setNewPost,
  } = useNewPostStore()

  const createPollingCandidate = useCallback(() => {
    addCandidate({
      index: candidates.length,
      payload: {
        listId: nanoid(10),
        title: "",
        imageSrc: "",
        description: "",
        pick: 0,
        number: candidates.length + 1,
      } as PollingCandidateType,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates.length])

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination || typeof destination.index !== "number") return

    moveCandidate({ from: source.index, to: destination.index })
  }

  const onChangeCandidateLayout = (style: ContentLayoutType) => {
    setContent({ type: "layout", payload: style })
  }

  const onChangeInput = (e: any, type: "title" | "description") => {
    if (type === "title" && e.target.value.length >= 60) return
    if (type === "description" && e.target.value.length >= 80) return

    setNewPost({ type, payload: e.target.value })
  }

  return (
    <div className={cx("main")}>
      <div className={cx("editor")}>
        <section className={cx("styler-section")}>
          <h1>제목 입력</h1>
          <input
            className={"title-input"}
            placeholder="제목 입력"
            value={newPost.title ?? ""}
            onChange={(e) => onChangeInput(e, "title")}
          />
        </section>
        <section className={cx("styler-section")}>
          <h1>설명 입력</h1>
          <input
            className={"description-input"}
            placeholder="설명 입력 (옵션)"
            value={newPost.description ?? ""}
            onChange={(e) => onChangeInput(e, "description")}
          />
        </section>
        <section className={cx("styler-section")}>
          <h1>후보 스타일 변경</h1>
          <div className={cx(style["layout-list"])}>
            {selectorTypes.map(({ value, icons, label }) => (
              <button
                key={value}
                onClick={() => onChangeCandidateLayout(value as ContentLayoutType)}
                className={cx(style.card, { [style.active]: content.layout === value })}
              >
                <div className={cx(style["icon-wrapper"])}>
                  {icons.map((icon, index) => (
                    <i key={index} className={cx("fa-solid", icon, style[icon])} />
                  ))}
                </div>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </section>
        <section className={cx("styler-section")}>
          <h1>후보 등록</h1>
          <div className={cx(style["candidate-list"])}>
            <DragDropContext
              onBeforeCapture={() => {
                setSelectedCandidateIndex(-1)
              }}
              onDragEnd={onDragEnd}
            >
              <Droppable droppableId="candidate-drop-zone">
                {(provided) => (
                  <div
                    className={cx(style["candidate-drop-zone"])}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <ul>
                      <li
                        style={{
                          animation:
                            candidates.length === 0 ? "none" : style["no-candidate-disappear"] + " 500ms forwards",
                        }}
                        className={cx(style["no-candidate"])}
                      >
                        <span>후보가 없어요</span>
                      </li>
                      {candidates.map((candidate, i) => (
                        <Draggable index={i} key={candidate.listId} draggableId={candidate.listId}>
                          {(draggableProvided) => {
                            const [grabDisplay, setGrabDisplay] = useState(true)
                            const [animation, setAnimation] = useState<string | null>(style.opacity)
                            useEffect(() => {
                              setTimeout(() => {
                                setAnimation(null)
                              }, 800)
                            }, [])

                            return (
                              <li {...draggableProvided.draggableProps} ref={draggableProvided.innerRef}>
                                <div className={cx(style.list)}>
                                  <button
                                    style={
                                      grabDisplay
                                        ? animation
                                          ? { animation: animation + " 500ms 300ms forwards" }
                                          : { opacity: 1 }
                                        : { display: "none" }
                                    }
                                    {...draggableProvided.dragHandleProps}
                                    className={cx(style.grab)}
                                  >
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M6 15H6.01M6 9H6.01M12 9H12.01M18 9H18.01M18 15H18.01M12 15H12.01M7 9C7 9.55228 6.55228 10 6 10C5.44772 10 5 9.55228 5 9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9ZM7 15C7 15.5523 6.55228 16 6 16C5.44772 16 5 15.5523 5 15C5 14.4477 5.44772 14 6 14C6.55228 14 7 14.4477 7 15ZM13 9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9C11 8.44772 11.4477 8 12 8C12.5523 8 13 8.44772 13 9ZM13 15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15C11 14.4477 11.4477 14 12 14C12.5523 14 13 14.4477 13 15ZM19 9C19 9.55228 18.5523 10 18 10C17.4477 10 17 9.55228 17 9C17 8.44772 17.4477 8 18 8C18.5523 8 19 8.44772 19 9ZM19 15C19 15.5523 18.5523 16 18 16C17.4477 16 17 15.5523 17 15C17 14.4477 17.4477 14 18 14C18.5523 14 19 14.4477 19 15Z"
                                        stroke="rgba(161, 161, 161, 0.6)"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                  <Candidate setGrabDisplay={setGrabDisplay} candidate={candidate} targetIndex={i} />
                                </div>
                                <SelectPart index={i} candidate={candidate as PollingCandidateType} />
                              </li>
                            )
                          }}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <div className={cx(style["add-candidate-btn"])}>
              <button onClick={createPollingCandidate}>
                <i className={cx("fa-solid", "fa-plus")} />
              </button>
            </div>
          </div>
        </section>
        <ChartDescription />
      </div>
    </div>
  )
}
