import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
})

export async function sendEmail(to, subject, text) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  }
  await transporter.sendMail(mailOptions)
}
