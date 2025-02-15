import { Prisma } from '@prisma/client'
import { Request, Response, Router } from 'express'
import { prisma } from 'src/prisma-client'

const quizRouter = Router()

quizRouter.get(
  '/',
  async (req: Request<{}, {}, {}, { page: string }>, res: Response) => {
    const pageNumber = Number(req.query.page) || 1
    const pageSize = 10
    const offset = (pageNumber - 1) * pageSize
    const quizes = await prisma.quiz.findMany({
      skip: offset,
      take: pageSize,
    })

    const quizesTotalCount = quizes.length

    const pageCount = Math.ceil(quizesTotalCount / 10)

    res.send({
      pagination: {
        pageCount: pageCount,
        total: quizesTotalCount,
        currentPage: pageNumber,
      },
      quizes: quizes,
    })
  }
)

quizRouter.post(
  '/create',
  async (
    req: Request<
      {},
      {},
      Prisma.QuizGetPayload<{
        include: { questions: { include: { answers: true } } }
      }>
    >,
    res: Response
  ) => {
    const { description, imageUrl, questions, title } = req.body

    const newQuiz = await prisma.quiz.create({
      data: {
        title: title,
        description: description,
        questions: {
          create: questions?.map((q) => ({
            title: q.title,
            answers: {
              create: q.answers.map((answer) => ({
                title: answer.title,
                isCorrect: answer.isCorrect,
              })),
            },
          })),
        },
      },
    })

    res.send({ newQuiz: newQuiz })
  }
)

quizRouter.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params

    const quizData = await prisma.quiz.findFirst({
      where: { id: Number(id) },
      include: { questions: { include: { answers: true } } },
    })
    res.status(200).send({ quiz: quizData })
  } catch (error) {
    res.status(404).send('Такого квиза нет')
  }
})

export default quizRouter
