import express from 'express'
import { forgetPassword, login, logout, signup, verifyUser } from '../controller/user.controller'

const user_router = express.Router()


user_router.route('/signup').post(signup)
user_router.route('/login').post(login)
user_router.route('/verifyUser').post(verifyUser)
user_router.route('/forgetPassword/:id').post(forgetPassword)
user_router.route('/logout').post(logout)


export default user_router