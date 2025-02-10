export interface Question {
  title: string
  image?: string
  answers: {
    title: string
    isCorrect: boolean
  }[]
}