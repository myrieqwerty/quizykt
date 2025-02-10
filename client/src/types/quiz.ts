import { Question } from "./question"

export interface Quiz {
  _id: string
  title: string
  description: string
  image?: string
  questions: Question[]
}