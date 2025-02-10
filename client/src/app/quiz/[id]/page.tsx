import { getQuiz } from "@/api/get-quiz"

export default async function QuizPage({params}: {params: Promise<{id: string}>}) {
  const data = await getQuiz((await params).id)
  console.log(data)
  return (
    <main className="max-w-[1024px] mx-auto">
      <h1>quiz page: {data.quiz.title}</h1>
      <div>{data.quiz.description}</div>
    </main>
  )
}
