import { borderColors } from "@/_data/colors"

export default function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * borderColors.length)
  return borderColors[randomIndex]
}
