import { Request, Response, NextFunction } from 'express'
import ErrorHandler from '../utils/ErrorHandler'
import jwt from 'jsonwebtoken'
import user_model from '../model/user.model'
import { Types } from 'mongoose'

export const decodeUser = async (req: Request, _res: Response, next: NextFunction) => {
     try {
          const { refresh_token } = req.cookies
          if (!refresh_token) {
               return next(new ErrorHandler("unauthorized", 401))
          }
          const decodedUser = jwt.verify(refresh_token, process.env.REFRESH_TOKEN!)
          if (!decodedUser) {
               return next(new ErrorHandler("token expired", 400))
          }
          if (typeof decodedUser === "object" && "_id" in decodedUser) {
               const ObjectId = new Types.ObjectId(decodedUser?._id)
               const foundUser = await user_model.findById(ObjectId)
               if (!foundUser) {
                    return next(new ErrorHandler("user not found", 404))
               }
               req.body.id = foundUser!._id

               next()
          }

     } catch (error) {
          next(error)
     }
} 