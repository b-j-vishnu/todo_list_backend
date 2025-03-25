import nodemailer from "nodemailer";

let emailConfig = {
     host: 'smtp.gmail.com',
     port: 587,
     secure: false,
     auth: {
          user: 'vishnuhnu250@gmail.com',
          pass: 'jegp senw hgsm dfuj',
     },
}

let sender = 'vishnuhnu250@gmail.com';

export default class MailController {
     static async sampleMail(toEmail, pdfBuffer) {

          let message = {
               from: sender,
               to: toEmail,
               html: "<h1>Here is your pdf </h1>",
               text: 'Body of the mail.',
               attachments: [
                    {
                         filename: 'generated-file.pdf', // The name of the file in the email attachment
                         content: pdfBuffer, // The PDF content (Buffer)
                         encoding: 'base64', // You can specify encoding if needed (for Buffer it's not always necessary)
                    },
               ],

          }
          this.mailSender(message);
     }

     static async mailSender(data) {
          let transporter = nodemailer.createTransport(emailConfig);
          transporter.verify((error) => error ? error : '');
          transporter.sendMail(data);
     }

}
