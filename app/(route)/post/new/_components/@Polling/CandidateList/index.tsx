"use client"

import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"

import { useNewPostStore } from "@/_store/newPost"
import { nanoid } from "nanoid"

import { usePollingStore } from "@/_store/newPost/polling"
import { randomNum } from "@/_utils/math"
import { useCallback } from "react"
import Candidate from "../Candidate"
import "./style.scss"

export default function CandidateList() {
  const { newPostStatus } = useNewPostStore()
  const { newCandidates, addCandidate, moveCandidates } = usePollingStore()

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

  return (
    <>
      <div
        style={{ animation: newCandidates.length === 0 ? "none" : "no-candidate-disappear 500ms forwards" }}
        className="no-candidate"
      >
        <span>후보가 없어요</span>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="candidate-drop-zone">
          {(provided) => (
            <div className="candidate-drop-zone" {...provided.droppableProps} ref={provided.innerRef}>
              <ul className="candidate-list">
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
                        <Candidate candidate={candidate} index={i} isResultPage={newPostStatus === "result"} />
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
        <div className="add-candidate-btn">
          <button onClick={createNewCandidate}>
            <i className="fa-solid fa-plus" />
          </button>
        </div>
      )}
    </>
  )
}
