import { Question } from "@/types/question"
import { Quiz } from "@/types/quiz"

type getQuizResult = {
  quiz: Quiz
  questions: Question[]
}

export const getQuiz = async (id: string) => {

  const res = await fetch('http://localhost:4000/quiz/' + id)
  const data : getQuizResult = await res.json()
  return data

}