import express from 'express'
import { sendMailWithPdf } from '../controller/pdf.controller'

const pdfRouter = express.Router()

pdfRouter.get('/sendMail', sendMailWithPdf)

export default pdfRouter