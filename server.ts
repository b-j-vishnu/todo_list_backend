import app from "./src/app"
import { dbconnection } from "./src/config/dbconnection"


const startSever = () => {
     const server = app.listen(process.env.PORT, () => {
          console.log(`server is runngin on ${process.env.PORT}`)
     })

     process.on('SIGTERM', () => {
          server.close(() => {
               console.log('shutting down gracefully due to terminate - CTRL + C')

          })
     })
     process.on('SIGINT', () => {
          server.close(() => {
               console.log('shutting down gracefully due to terminate - External access')

          })
     })
}

dbconnection().then(startSever)