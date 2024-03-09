export const setParticipate = ({ postId, listId }: { postId: string; listId: string }) => {
  const participated: string[] = JSON.parse(localStorage.getItem("participated") ?? "[]")

  if (process.env.NODE_ENV === "production") {
    // memo: submit을 했다는건 안했다는거임. 한 사람은 이미 리디렉트 당함
    const obj = { postId, listId }
    if (participated.length > 0) {
      if (!participated.find((v) => v === postId))
        localStorage.setItem("participated", JSON.stringify([...participated, obj]))
    } else {
      localStorage.setItem("participated", JSON.stringify([obj]))
    }
  }
}
