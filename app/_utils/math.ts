export const randomNum = (min: number, max: number) => Math.floor(Math.random() * max) + min

export const calculateVoteRatio = (leftCount: number, rightCount: number) => {
  const totalVotes = leftCount + rightCount

  if (totalVotes === 0) {
    // 투표가 없을 경우
    return { left: "0", right: "0" }
  }

  const leftPercentage = ((leftCount / totalVotes) * 100).toFixed(2)
  const rightPercentage = ((rightCount / totalVotes) * 100).toFixed(2)

  return { left: leftPercentage, right: rightPercentage }
}
