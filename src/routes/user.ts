import { Request, Response, Router } from 'express'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Prisma } from '@prisma/client'
import { prisma } from 'src/prisma-client'

const userRouter = Router()

userRouter.post(
  '/register',
  async (req: Request<{}, {}, Prisma.UserGetPayload<{}>>, res: Response) => {
    try {
      const { name, surname, email, password, phone } = req.body

      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)

      const newUser = await prisma.user.create({
        data: {
          email: email,
          name: name,
          surname: surname,
          password: hashPassword,
          phone: phone,
        },
      })

      if (!newUser) {
        res.status(400).send('Пользователь уже существует')
      }

      res.status(200).send({ newUser: newUser })
    } catch (error) {
      res.status(400).send('register error')
    }
  }
)

userRouter.post(
  '/login',
  async (
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response
  ) => {
    const { email, password } = req.body

    const user = await User.findOne({ email: email })

    if (!user) {
      res.json({ error: 'пользователь не найден' })
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        res.status(401).send('Mobile/Email or Password is wrong')
      } else {
        const payload = { id: user._id, name: user.name }
        const token = jwt.sign(payload, process.env.TOKEN_SECRET!, {
          expiresIn: '2d',
        })
        res
          .status(200)
          .header('token', token)
          .send({ token: token, payload: jwt.decode(token) })
      }
    }
  }
)

export default userRouter
