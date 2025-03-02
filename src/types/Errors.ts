export interface ICastError extends Error {
     path: string,
     name: string,
     kind: string
     statusCode: number
}
export interface ITokenExpiredError extends Error {
     expiredAt: string
     statusCode: number
}

export interface IValidationError extends Error {
     errors: {
          [key: string]: {
               properties: {
                    path: string,
                    enumValues: string
               }
          }
     },
     statusCode: number

}