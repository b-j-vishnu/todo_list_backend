import { Document, Types } from "mongoose"

export interface IUser extends Document {
     username: string,
     password: string,
     todos?: Types.ObjectId[]
}