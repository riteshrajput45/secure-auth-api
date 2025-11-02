const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   // your Gmail ID
      pass: process.env.EMAIL_PASS,   // your Gmail app password
    },
  });

  const mailOptions = {
    from: '"Codeverse App" <no-reply@codeverse.com>',
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
