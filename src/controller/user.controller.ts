import { Request, Response, NextFunction } from 'express'
import ErrorHandler from '../utils/ErrorHandler'
import user_model from '../model/user.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     try {
          const { username, password } = req.body
          if (!username || !password) {
               return next(new ErrorHandler("All fields are required", 400))
          }

          const exists_user = await user_model.findOne({ username })

          if (exists_user) {
               return next(new ErrorHandler("user already exists", 409))
          }
          const hash_password = await bcrypt.hash(password, 10)
          const new_user = await user_model.create({
               username,
               password: hash_password,
          })
          if (!new_user) {
               return next(new ErrorHandler("can't create user", 500))
          }
          res.status(201).json({
               success: true,
               message: "user created successfully",
               data: new_user
          })
     } catch (error) {
          next(error)
     }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     try {
          const { username, password } = req.body
          if (!username || !password) {
               return next(new ErrorHandler("username and password are required", 400))
          }
          const exists_user = await user_model.findOne({ username })
          if (!exists_user) {
               return next(new ErrorHandler("first signup and then do login", 404))
          }
          const password_match = await bcrypt.compare(password, exists_user?.password!)
          if (!password_match) {
               return next(new ErrorHandler("password doesn't match", 400))
          }
          const token = jwt.sign({ username: exists_user.username, _id: exists_user._id! }, process.env.SECRET_TOKEN!, {
               expiresIn: '7d'
          })

          res.cookie('token', token, {
               expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
               httpOnly: true,
               sameSite: 'strict',
               secure: true
          })
          res.status(200).json({
               success: true,
               message: "user loggged in successfully",

          })
     } catch (error) {
          next(error)
     }
}
export const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     try {
          const { username } = req.body
          if (!username) {
               return next(new ErrorHandler("username is required", 400))
          }
          const exists_user = await user_model.findOne({ username })
          if (!exists_user) {
               return next(new ErrorHandler("user not found", 404))
          }
          res.status(200).json({
               success: true,
               id: exists_user?._id!
          })
     } catch (error) {
          next(error)
     }
}

export const forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     try {
          const { id } = req.params
          const { password } = req.body
          if (!id || !Types.ObjectId.isValid(id) || !password) {
               return next(new ErrorHandler("id is required", 400))
          }
          const ObjectId = new Types.ObjectId(id)
          const hash_password = await bcrypt.hash(password, 10)
          const found_user = await user_model.findByIdAndUpdate(ObjectId, {
               password: hash_password,
          })
          if (!found_user) {
               return next(new ErrorHandler("user not found", 404))
          }
          res.status(200).json({
               success: false,
               message: "password changed succesfully"
          })
     } catch (error) {
          next(error)
     }
}

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     try {
          const { token } = req.cookies
          if (!token) {
               return next(new ErrorHandler("no token", 404))
          }
          const decoded = jwt.verify(token, process.env.SECRET_TOKEN!) as { _id: string } | string

          if (!decoded) {
               return next(new ErrorHandler("Token expired", 404))
          }
          else {
               res.clearCookie("token")
               res.status(200).json({
                    success: true,
                    message: "logout successfully",

               })

          }



     } catch (error) {
          next(error)
     }
}