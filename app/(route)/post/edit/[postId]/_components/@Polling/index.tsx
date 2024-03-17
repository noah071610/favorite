"use client"

import { useNewPostStore } from "@/_store/newPost"
import TextareaAutosize from "react-textarea-autosize"

import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"

import { nanoid } from "nanoid"

import NewPostLayout from "@/_components/NewPostLayout"
import { CandidateType, ContentLayoutType } from "@/_types/post"
import { faHeading, faImage, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Candidate from "./Candidate"
import SelectPart from "./SelectPart"
import style from "./style.module.scss"

const selectorTypes = [
  { value: "textImage", icons: [faHeading, faPlus, faImage], label: "textImage" },
  { value: "image", icons: [faImage], label: "image" },
  { value: "text", icons: [faHeading], label: "text" },
]

const cx = classNames.bind(style)

const ChartDescription = () => {
  const { t } = useTranslation(["newPost"])
  const {
    content: { resultDescription },
    setContent,
  } = useNewPostStore()
  const onChangeDescription = (e: any) => {
    setContent({ type: "resultDescription", payload: e.target.value })
  }
  return (
    <section className={cx("styler-section")}>
      <h1>{t("chartDesc")}</h1>
      <TextareaAutosize
        placeholder={t("enterChartDesc")}
        className={cx(style["description-input"])}
        value={resultDescription ?? ""}
        onChange={onChangeDescription}
        maxLength={180}
      />
    </section>
  )
}

const CandidateList = ({
  candidate,
  i,
  draggableProvided,
}: {
  candidate: {
    [key: string]: any
  }
  i: number
  draggableProvided: any
}) => {
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
      <SelectPart index={i} candidate={candidate as CandidateType} />
    </li>
  )
}

export default function PollingContent() {
  const { t } = useTranslation(["newPost"])
  const {
    content: { candidates, layout },
    moveCandidate,
    setContent,
    setSelectedCandidateIndex,
    addCandidate,
  } = useNewPostStore()

  const createPollingCandidate = useCallback(() => {
    addCandidate({
      payload: {
        listId: nanoid(10),
        title: "",
        imageSrc: "",
        description: "",
        pick: 0,
        lose: 0,
        win: 0,
        number: candidates.length + 1,
      },
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

  return (
    <NewPostLayout>
      <section className={cx("styler-section")}>
        <h1>{t("changeLayoutStyle")}</h1>
        <div className={cx(style["layout-list"])}>
          {selectorTypes.map(({ value, icons, label }) => (
            <button
              key={value}
              onClick={() => onChangeCandidateLayout(value as ContentLayoutType)}
              className={cx(style.card, { [style.active]: layout === value })}
            >
              <div className={cx(style["icon-wrapper"])}>
                {icons.map((icon, index) => (
                  <FontAwesomeIcon key={index} className={cx(index === 1 ? style["fa-plus"] : "")} icon={icon} />
                ))}
              </div>
              <span>{t(`layout.${label}`)}</span>
            </button>
          ))}
        </div>
      </section>
      <section className={cx("styler-section")}>
        <h1>{t("enterCandidate")}</h1>
        <div className={cx(style["candidate-list"])}>
          <DragDropContext
            onBeforeCapture={() => {
              setSelectedCandidateIndex(-1)
            }}
            onDragEnd={onDragEnd}
          >
            <Droppable droppableId="candidate-drop-zone">
              {(provided) => (
                <div className={cx(style["candidate-drop-zone"])} {...provided.droppableProps} ref={provided.innerRef}>
                  <ul>
                    <li
                      style={{
                        animation:
                          candidates.length === 0 ? "none" : style["no-candidate-disappear"] + " 500ms forwards",
                      }}
                      className={cx(style["no-candidate"])}
                    >
                      <span>{t("noCandidates")}</span>
                    </li>
                    {candidates.map((candidate, i) => (
                      <Draggable index={i} key={candidate.listId} draggableId={candidate.listId}>
                        {(draggableProvided) => {
                          return <CandidateList candidate={candidate} i={i} draggableProvided={draggableProvided} />
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
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>
      </section>
      <ChartDescription />
    </NewPostLayout>
  )
}
