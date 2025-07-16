const nodemailer = require("nodemailer");
// const { options } = require("../routes/admin");

const sendEmail =async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOpts={
    from:`"File-Sharing-App" <${process.env.EMAIL_USER}>`,
    to:options.email,//dynamic
    subject:options.subject,
    text:options.message,
  }
  await transporter.sendMail(mailOpts)
};

module.exports=sendEmail;