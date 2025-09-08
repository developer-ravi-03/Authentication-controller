import nodemailer from "nodemailer";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email, otp) {
  let transporter = nodemailer.createTransport({
    service: "gmail", // Use Gmail SMTP
    auth: {
      user: "on.developerravi@gmail.com", // your Gmail
      pass: "ptlklznqroeirowg", // app password (not your Gmail password!)
    },
  });

  let info = await transporter.sendMail({
    from: '"E-Commerce" <your_email@gmail.com>',
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
    html: `<b>Your OTP code is: ${otp}</b>`,
  });

  console.log("Message sent: %s", info.messageId);
}
