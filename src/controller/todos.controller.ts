import { NextFunction, Response, Request } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import user_model from "../model/user.model";
import { Types } from "mongoose";
import todo_model from "../model/todos.model";

export const createTodo = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { id, title, priority, description } = req.body
          if (!id || !Types.ObjectId.isValid(id)) {
               return next(new ErrorHandler("Can't add", 400))
          }
          if (!title || !priority) {
               return next(new ErrorHandler("title and priority are required", 400))
          }
          const ObjectId = new Types.ObjectId(id)
          const foundUser = await user_model.findById(ObjectId)
          if (!foundUser) {
               return next(new ErrorHandler("User not found", 404))
          }
          const newTodo = await todo_model.create({ title, priority, description })
          foundUser!.todos?.push(new Types.ObjectId(newTodo?._id as Types.ObjectId))
          await foundUser.save()

          res.status(200).json({
               success: true,
               message: "New todo added successfully",
               data: newTodo
          })

     } catch (error) {
          next(error)
     }
}

export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { id } = req.params
          const { title, status, priority } = req.body

          if (!id || !Types.ObjectId.isValid(id) || !title && !status && !priority) {
               next(new ErrorHandler("Invalid inputs", 400))
          }
          const ObjectId = new Types.ObjectId(id)
          const updatedTodo = await todo_model.findByIdAndUpdate(ObjectId, {
               title,
               status,
               priority
          }, { new: true, runValidators: true })
          if (!updatedTodo) {
               next(new ErrorHandler("Todo not found", 404))
          }
          res.status(200).json({
               success: true,
               message: "Todo updated successfully",
               data: updatedTodo
          })
     } catch (error) {
          next(error)
     }
}

export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { id } = req.params
          if (!id || !Types.ObjectId.isValid(id)) {
               next(new ErrorHandler("Invalid id", 400))

          }
          const ObjectId = new Types.ObjectId(id)
          const deletedTodo = await todo_model.findByIdAndDelete(ObjectId, { new: true })
          if (!deletedTodo) {
               next(new ErrorHandler("Todo not found", 400))
          }
          res.status(200).json({
               success: true,
               message: "Todo deleted successfully",
               data: deletedTodo
          })
     } catch (error) {
          next(error)
     }
}

export const searchTodo = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { searchTerm = "", page = 1, limit = 10 } = req.query
          const filteredTodos = await todo_model.aggregate([
               {
                    $facet: {
                         totalCounts: [
                              { $count: "totalCount" }
                         ],
                         filteredData: [
                              {
                                   $match: {
                                        $or: [
                                             { title: new RegExp(`${searchTerm}`, "ig") },
                                             { status: new RegExp(`${searchTerm}`, "ig") },
                                             { priority: new RegExp(`${searchTerm}`, "ig") }
                                        ]
                                   }
                              },
                              {
                                   $group: {
                                        _id: null,
                                        filteredCount: { $sum: 1 },
                                        data: { $push: "$$ROOT" }
                                   }
                              },
                              {
                                   $project: {
                                        _id: 0,
                                        filteredCount: 1,
                                        data: { $slice: ["$data", (Number(page) - 1) * Number(limit), Number(limit)] }
                                   }
                              }
                         ]
                    }
               }
          ]);
          const totalCounts = filteredTodos[0].totalCounts[0].totalCount
          const count = filteredTodos[0].filteredData[0].filteredCount
          const data = filteredTodos[0].filteredData[0].data


          res.status(200).json({
               success: true,
               message: "Todo searched successfully",
               totalCounts,
               count,
               data,
          })
     } catch (error) {
          next(error)
     }

}

export const getTodo = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { id } = req.params
          if (!id || !Types.ObjectId.isValid(id)) {
               return next(new ErrorHandler("Invalid Id", 400))
          }
          const ObjectId = new Types.ObjectId(id)
          const foundTodo = await todo_model.findById(ObjectId)

          if (!foundTodo) {
               return next(new ErrorHandler("Todo not found", 404))
          }
          res.status(200).json({
               success: true,
               message: "Todo get successfully",
               data: foundTodo
          })
     } catch (error) {
          next(error)
     }
}