import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import MailController from '../config/MailController';
import ejs from 'ejs'
import { Request, Response } from 'express'
import puppeteer from 'puppeteer'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const sendMailWithPdf = async (_req: Request, res: Response) => {
     try {
          console.log(__dirname)
          const filepath = path.join(__dirname, '../views', '/sample.ejs')
          console.log(fs.existsSync(filepath))

          const htmlContent = await ejs.renderFile(filepath, { data: { name: "vishnu" } })

          const browser = await puppeteer.launch({
               headless: true,
               args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
               ],
          });
          const page = await browser.newPage()
          await page.setContent(htmlContent, { waitUntil: "domcontentloaded" })
          const pdfBuffer = await page.pdf({
               format: 'A4',
               printBackground: true
          })

          MailController.sampleMail("sakthits1920@gmail.com", pdfBuffer)
               .then(() => {
                    return res.status(200).type('json').send('Email sent successfully')
               })
     } catch (error) {
          res.status(500).send('Unknown error')
          throw error;
     }
}