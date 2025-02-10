import { Request, Response, Router } from 'express'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userRouter = Router()

userRouter.post(
  '/register',
  async (req: Request<{}, {}, IUser>, res: Response) => {
    try {
      const { email, name, surname, password, avatar, phone } = req.body

      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)

      const user = await User.create({
        email,
        name,
        surname,
        password: hashPassword,
        avatar,
        phone,
      })

      res.status(200).send({ user: user })
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
