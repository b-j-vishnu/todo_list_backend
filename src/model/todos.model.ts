import { model, Schema } from "mongoose";
import { ITodos } from "../types/todos";

const todos_schema = new Schema<ITodos>({
     title: {
          type: String,
          trim: true,
          required: [true, "Title is required"]
     },
     description: {
          type: String,
     },
     status: {
          type: String,
          enum: ["Pending", "In Progress", "Completed"],
          default: "Pending"
     },
     priority: {
          type: String,
          enum: ["Low", "Medium", "High"]
     }

})

const todo_model = model('todos', todos_schema)
export default todo_model