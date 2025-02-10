import { json, urlencoded } from 'body-parser'
import { configDotenv } from 'dotenv'
import express from 'express'
import { Request, Response } from 'express'
import quizRouter from '@routes/quiz'
import userRouter from '@routes/user'

async function run() {
  try {
    configDotenv()

    const app = express()

    const DATABASE_URL = process.env.DATABASE_URL || ''
    const PORT = process.env.PORT || 4000

    app.use(json())
    app.use(urlencoded({ extended: true }))

    app.get('/', (req: Request, res: Response) => {
      res.send('hello world')
    })

    app.use('/quiz', quizRouter)
    //app.use('/', userRouter)

    app.listen(PORT, () => {
      console.log('сервер запущен на порту:', PORT)
    })
  } catch (error) {
    console.log(error)
  }
}

run()
