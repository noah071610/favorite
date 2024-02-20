"use client"

import { useNewPostStore } from "@/_store/newPost"

import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"

import { nanoid } from "nanoid"

import style from "@/(route)/post/polling/[postId]/style.module.scss"
import PostInfo from "@/_components/PostInfo"
import { usePollingStore } from "@/_store/newPost/polling"
import { PollingLayoutType } from "@/_types/post/post"
import { UserType } from "@/_types/user"
import { randomNum } from "@/_utils/math"
import classNames from "classNames"
import { useCallback } from "react"
import Candidate from "./Candidate"
import SelectPart from "./SelectPart"
import _style from "./style.module.scss"

const selectorTypes = [
  { value: "textImage", icons: ["fa-heading", "fa-plus", "fa-image"], label: "이미지와 텍스트" },
  { value: "image", icons: ["fa-image"], label: "이미지 중심" },
  { value: "text", icons: ["fa-heading"], label: "텍스트만" },
]

const cx = classNames.bind(style)

export default function PollingContent({ user }: { user: UserType }) {
  const { newPost, newPostStatus, setNewPost } = useNewPostStore()
  const { newCandidates, addCandidate, moveCandidates, setLayoutType, layoutType } = usePollingStore()

  const createNewCandidate = useCallback(() => {
    addCandidate({
      listId: nanoid(10),
      title: "",
      imageSrc: "",
      description: "",
      count: randomNum(1, 100),
      number: newCandidates.length + 1,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCandidates.length])

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination || typeof destination.index !== "number") return

    moveCandidates(draggableId, source.index, destination.index)
  }

  const onChangeCandidateLayout = (style: PollingLayoutType) => {
    setLayoutType(style)
  }

  return (
    newPost && (
      <>
        {/* CANDIDATE LAYOUT FOR EDIT SECTION */}
        {newPostStatus === "edit" && (
          <div className={cx(_style.styler)}>
            {newPost?.type === "polling" && (
              <section className={cx(_style["styler-section"])}>
                <h1>후보 스타일 변경</h1>
                <div className={cx(_style.list)}>
                  {selectorTypes.map(({ value, icons, label }) => (
                    <button
                      key={value}
                      onClick={() => onChangeCandidateLayout(value as PollingLayoutType)}
                      className={cx(_style.card, { [_style.active]: layoutType === value })}
                    >
                      <div className={cx(_style["icon-wrapper"])}>
                        {icons.map((icon, index) => (
                          <i key={index} className={cx("fa-solid", icon, _style[icon])} />
                        ))}
                      </div>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
        <div className={cx(style["polling-post"])}>
          <div className={cx(style["polling-post-inner"])}>
            <PostInfo title={newPost.title} description={newPost.description} user={user} isEdit={true} />
            <div
              className={cx(style.content, {
                [style[`layout-${layoutType}`]]: layoutType,
              })}
            >
              <div className={cx(style.left)}>
                <ul className={cx(style["candidate-list"])}>
                  <div
                    style={{
                      animation:
                        newCandidates.length === 0 ? "none" : _style["no-candidate-disappear"] + " 500ms forwards",
                    }}
                    className={cx(_style["no-candidate"])}
                  >
                    <span>후보가 없어요</span>
                  </div>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="candidate-drop-zone">
                      {(provided) => (
                        <div className={cx("candidate-drop-zone")} {...provided.droppableProps} ref={provided.innerRef}>
                          <ul className={cx(style["candidate-list"])}>
                            {newCandidates.map((candidate, i) => (
                              <Draggable
                                isDragDisabled={newPostStatus === "result"}
                                index={i}
                                key={candidate.listId}
                                draggableId={candidate.listId}
                              >
                                {(draggableProvided) => (
                                  <div
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.dragHandleProps}
                                    {...draggableProvided.draggableProps}
                                  >
                                    <Candidate
                                      candidate={candidate}
                                      index={i}
                                      isResultPage={newPostStatus === "result"}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  {newPostStatus === "edit" && (
                    <div className={cx(_style["add-candidate-btn"])}>
                      <button onClick={createNewCandidate}>
                        <i className={cx("fa-solid", "fa-plus")} />
                      </button>
                    </div>
                  )}
                </ul>
              </div>
              <div className={cx(style.right)}>
                <SelectPart />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  )
}
