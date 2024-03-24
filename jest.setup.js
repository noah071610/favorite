import "@testing-library/jest-dom"
import { useParams } from "next/navigation"

jest.mock("@/i18n", () => ({
  useTranslation: () => ({ t: (key) => key }),
}))

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}))

const mockRouter = {
  lang: "ko", // 테스트할 ID를 여기에 설정
}

useParams.mockReturnValue(mockRouter)
