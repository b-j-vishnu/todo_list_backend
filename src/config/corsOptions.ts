import cors from 'cors'

const allowedOrigins = ["http://localhost:5173"]

cors({
     credentials: true,
     origin: (origin, callback) => {
          if (allowedOrigins.includes(origin!) || origin) {
               callback(null, true)
          }
          else {
               callback(new Error("Not allowed by cors"), false)
          }
     },
     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
})

export default cors