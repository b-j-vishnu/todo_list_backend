import { Document } from "mongoose"

export interface ITodos extends Document {
     title: string,
     description: string,
     status: "Pending" | "In Progress" | "Completed",
     priority: "Low" | "Medium" | "High"
}