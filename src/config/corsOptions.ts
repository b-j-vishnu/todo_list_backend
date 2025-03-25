import cors from 'cors'

const allowedOrigins = ["http://localhost:5173"]

const corsOptions = cors({
     credentials: true,
     origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
               callback(null, true)
          }
          else {
               callback(new Error("Not allowed by cors"))
          }
     },
     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
})

export default corsOptions