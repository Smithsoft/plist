// /helpers/sendmail.ts
import { Request, Response } from "express"
import * as nodeMailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"

const sendmail = (req: Request, res: Response, emailData: Mail.Options):void => {
    const transport = nodeMailer.createTransport(
        {
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                ciphers: "SSLv3"
            },
        }
    )
    transport.sendMail(emailData)
        .then(
            (mailinfo) => {
                console.log(`Message sent: ${mailinfo.response}`)
                return res.json({
                    message: 'Check your email to activate your account'
                })
            }
        )
        .catch(
            (err) => console.log(`Problem sending email: ${err}`)
        )
}

export default sendmail