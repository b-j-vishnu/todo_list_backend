import { Document, Types } from "mongoose"

export interface IUser extends Document {
     username: string,
     password: string,
     confirm_password: string
     refresh_token: string
     todos?: Types.ObjectId[]
}