import { Request, Response, NextFunction } from 'express'
import { ICastError, ITokenExpiredError, IValidationError } from '../types/Errors'


const handleError = (error: ICastError | ITokenExpiredError | IValidationError) => {
     console.log("Error_Name", error.name)
     if (error.name == "CastError" && "path" in error) {
          error.message = `${error.path} must be ${error.kind}`
     }
     if (error.name === "TokenExpiredError" && "expiredAt" in error) {
          const dateAndTime = new Date(error.expiredAt)
          error.message = `you have access with in ${dateAndTime}`
     }
     if (error.name === "ValidationError" && "errors" in error) {
          const messages = Object.entries(error.errors).map(([_key, value]) => `${value.properties.path} should be ${value.properties.enumValues}`)
          error.message = messages?.[0].replaceAll(',', '|')
     }
     return error
}

export const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
     const error = handleError(err as ICastError | ITokenExpiredError)
     const statusCode = error.statusCode || 500
     const message = error.message || "Internal Server Error"

     if (process.env.NODE_ENV === "production") {
          res.status(statusCode).json({
               success: false,
               message,
          })
     }
     if (process.env.NODE_ENV === "development") {
          res.status(statusCode).json({
               success: false,
               message,
               error,
               stack: error.stack
          })
     }
}