import { Request, Response, NextFunction } from 'express'
import ErrorHandler from '../utils/ErrorHandler'
import user_model from '../model/user.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     try {
          const { username, password, confirm_password } = req.body
          if (!username || !password || !confirm_password) {
               return next(new ErrorHandler("All fields are required", 400))
          }

          const exists_user = await user_model.findOne({ username })

          if (exists_user) {
               return next(new ErrorHandler("user already exists", 409))
          }
          const hash_password = await bcrypt.hash(password, 10)
          const hash_confirm_password = await bcrypt.hash(confirm_password, 10)
          const new_user = await user_model.create({
               username,
               password: hash_password,
               confirm_password: hash_confirm_password
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
          const refresh_token = jwt.sign({ username: exists_user.username, _id: exists_user._id! }, process.env.REFRESH_TOKEN!, {
               expiresIn: '7d'
          })
          const access_token = jwt.sign({ username: exists_user.username, _id: exists_user._id! }, process.env.ACCESS_TOKEN!, {
               expiresIn: '2m'
          })
          exists_user.refresh_token = refresh_token
          exists_user.save()
          res.cookie('refresh_token', refresh_token, {
               expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
               httpOnly: true,
               sameSite: 'strict',
               secure: process.env.NODE_ENV == "production"
          })
          res.status(200).json({
               success: true,
               message: "user loggged in successfully",
               access_token
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
               verified: true,
               id: exists_user?._id!
          })
     } catch (error) {
          next(error)
     }
}

export const forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     try {
          const { id } = req.params
          const { password, confirm_password } = req.body
          if (!id || !Types.ObjectId.isValid(id) || !password || !confirm_password) {
               return next(new ErrorHandler("id is required", 400))
          }
          const ObjectId = new Types.ObjectId(id)
          const hash_password = await bcrypt.hash(password, 10)
          const hash_confirm_password = await bcrypt.hash(confirm_password, 10)
          const found_user = await user_model.findByIdAndUpdate(ObjectId, {
               password: hash_password,
               confirm_password: hash_confirm_password
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
          const { refresh_token } = req.cookies
          if (!refresh_token) {
               return next(new ErrorHandler("no token", 404))
          }
          const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN!) as { _id: string } | string
          if (decoded && typeof decoded !== "string" && "_id" in decoded) {
               const ObjectId = new Types.ObjectId(decoded!._id)
               const found_user = await user_model.findByIdAndUpdate(ObjectId, { $unset: { refresh_token: "" } }, { new: true })
               if (!found_user) {
                    return next(new ErrorHandler("user not found", 404))
               }
               res.clearCookie("refresh_token")
               res.status(200).json({
                    success: true,
                    message: "logout successfully",

               })

          }



     } catch (error) {
          next(error)
     }
}