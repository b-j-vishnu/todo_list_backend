import { connect, set } from 'mongoose'


export const dbconnection = async () => {
     try {
          const db = await connect(process.env.MONGODB_URL!, {
               connectTimeoutMS: 20000,
               serverSelectionTimeoutMS: 20000
          })
          set('bufferCommands', false)
          console.log("DB connected - ", db.connection.db?.databaseName)

     } catch (error) {
          console.log("Error occured when trying to connect db")
     }
}