import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const token = req.headers.authorization?.split(' ')[1]!
    if (!token) {
      res.status(401).send({ message: 'Не авторизован' })
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY!)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).send({ message: 'Не авторизован' })
  }
}
