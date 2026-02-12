import { createTransport } from "nodemailer";

const createTransporter = () => {
  return createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });
};

// OTP mail
export const sendOtpMail = async (email, name, otp) => {
  const transport = createTransporter();
  const html = `
    <div style="font-family: Arial; text-align: center;">
      <h2>OTP Verification</h2>
      <p>Hello ${name}, your OTP code is:</p>
      <h1 style="color: purple;">${otp}</h1>
      <p>It will expire in 10 minutes.</p>
    </div>
  `;
  try {
    await transport.sendMail({ from: process.env.Gmail, to: email, subject: "Your OTP Code", html });
    console.log(`OTP email sent to ${email}`);
  } catch (err) {
    console.error("Failed to send OTP email:", err.message);
    throw new Error("Failed to send OTP email");
  }
};

// Forgot password mail
export const sendForgotMail = async (subject, data) => {
  const transport = createTransporter();
  const html = `
    <div style="font-family: Arial; text-align: center;">
      <h2>Reset Your Password</h2>
      <p>Hello,</p>
      <p>Click the link below to reset your password:</p>
      <a href="${data.resetLink}" style="padding: 10px 20px; background-color: #5a2d82; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
      <p>If you did not request this, ignore this email.</p>
    </div>
  `;
  try {
    await transport.sendMail({ from: process.env.Gmail, to: data.email, subject, html });
    console.log(`Forgot password email sent to ${data.email}`);
  } catch (err) {
    console.error("Failed to send forgot password email:", err.message);
    throw new Error("Failed to send forgot password email");
  }
};
