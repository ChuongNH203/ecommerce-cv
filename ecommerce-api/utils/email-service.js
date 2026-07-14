const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});

async function sendOtpEmail(toEmail, otpCode) {
  const mailOptions = {
    from: `"BeLo-Store" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Mã OTP xác thực đăng ký tài khoản',
    html: `
      <p>Chào bạn,</p>
      <p>Mã OTP để xác thực đăng ký tài khoản của bạn là: <b>${otpCode}</b></p>
      <p>Mã này có hiệu lực trong 10 phút.</p>
      <p>Trân trọng,<br/>BeLo-Store Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

async function sendOtpEmailUpdate(toEmail, otpCode) {
  const mailOptions = {
    from: `"BeLo-Store" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Mã OTP xác thực thay đổi email',
    html: `
      <p>Chào bạn,</p>
      <p>Mã OTP để xác thực email của bạn là: <b>${otpCode}</b></p>
      <p>Mã này có hiệu lực trong 10 phút.</p>
      <p>Trân trọng,<br/>BeLo-Store Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

async function sendNewsletter(toEmail, subject, text){
  const mailOptions = {
    from: process.env.SMTP_USER,  // Email người gửi
    to: toEmail,  // Địa chỉ email người nhận
    subject: subject,  // Tiêu đề email
    text: text,  // Nội dung bản tin
  };

  return transporter.sendMail(mailOptions);
};
module.exports = { sendOtpEmail,sendNewsletter,sendOtpEmailUpdate };
