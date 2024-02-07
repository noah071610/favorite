export const fadeMoveUpAnimation = (timing: number, delay?: number) => ({
  animation: `fade-move-up ${timing}ms ${delay ?? 0}ms cubic-bezier(0,1.1,.78,1) forwards`,
})

export const scaleUpAnimation = (timing: number, delay?: number) => ({
  animation: `scale-up ${timing}ms ${delay ?? 0}ms ease-out forwards`,
})
