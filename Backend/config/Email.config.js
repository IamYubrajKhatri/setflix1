import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "khatriyubraj1157@gmail.com",
      pass: "zngb nxci tmgh drtg",
    },
  });


