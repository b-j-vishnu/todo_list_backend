import express from 'express'
const todos_router = express.Router()
import { decodeUser } from '../middleware/VerfiyMiddleware'
import { createTodo, deleteTodo, getTodo, searchTodo, updateTodo } from '../controller/todos.controller'


todos_router.route('/create').post(decodeUser, createTodo)
todos_router.route('/update/:id').put(updateTodo)
todos_router.route('/delete/:id').delete(deleteTodo)
todos_router.route('/get/:id').get(getTodo)
todos_router.route('/search').get(decodeUser, searchTodo)

export default todos_router