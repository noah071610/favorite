"use client"

import { useNewPostStore } from "@/_store/newPost"
import TextareaAutosize from "react-textarea-autosize"

import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"

import { nanoid } from "nanoid"

import { PollingCandidateType } from "@/_types/post/polling"
import { ContentLayoutType } from "@/_types/post/post"
import classNames from "classNames"
import { useCallback } from "react"
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
    <section className={cx(style["styler-section"])}>
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
    <div className={cx(style.main)}>
      <div className={cx(style.editor)}>
        <section className={cx(style["styler-section"])}>
          <h1>제목 입력</h1>
          <input
            className={style["title-input"]}
            placeholder="제목 입력"
            value={newPost.title ?? ""}
            onChange={(e) => onChangeInput(e, "title")}
          />
        </section>
        <section className={cx(style["styler-section"])}>
          <h1>설명 입력</h1>
          <input
            className={style["description-input"]}
            placeholder="설명 입력 (옵션)"
            value={newPost.description ?? ""}
            onChange={(e) => onChangeInput(e, "description")}
          />
        </section>
        <section className={cx(style["styler-section"])}>
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
        <section className={cx(style["styler-section"])}>
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
                          {(draggableProvided) => (
                            <li className={cx(style["list"])} ref={draggableProvided.innerRef}>
                              <div
                                className={cx(style.list)}
                                {...draggableProvided.dragHandleProps}
                                {...draggableProvided.draggableProps}
                              >
                                <Candidate candidate={candidate} targetIndex={i} />
                              </div>
                              <SelectPart index={i} candidate={candidate as PollingCandidateType} />
                            </li>
                          )}
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
