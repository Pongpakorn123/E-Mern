import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpMail, sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

// REGISTER
export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password)
    return res.status(400).json({ message: "Provide email, name, password" });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const tempUser = { name, email, password: hashedPassword };
  const activationToken = jwt.sign({ user: tempUser, otp }, process.env.Activation_Secret, { expiresIn: "5m" });

  try {
    await sendOtpMail(email, name, otp);
    res.status(200).json({ message: "OTP sent to your email", activationToken });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
});

// VERIFY OTP
export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;
  if (!otp || !activationToken)
    return res.status(400).json({ message: "OTP or token missing" });

  const decoded = jwt.verify(activationToken, process.env.Activation_Secret);
  if (!decoded) return res.status(400).json({ message: "OTP expired" });

  if (decoded.otp !== otp.toString())
    return res.status(400).json({ message: "Wrong OTP" });

  await User.create({ ...decoded.user, role: "user" });
  res.json({ message: "User Registered Successfully" });
});

// LOGIN
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "No user with this email" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.Jwt_Sec, { expiresIn: "15d" });

  res.json({
    message: `Welcome back ${user.name}`,
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

// FORGOT PASSWORD
export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No user with this email" });

  const token = jwt.sign({ email }, process.env.Forgot_Secret, { expiresIn: "5m" });

  try {
    const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${token}`;
    await sendForgotMail("Reset Password", { email, resetLink });

    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    res.json({ message: "Reset password link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send reset email", error: error.message });
  }
});

// MY PROFILE
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ user });
});

// RESET PASSWORD
export const resetPassword = TryCatch(async (req, res) => {
  let decoded;
  try {
    decoded = jwt.verify(req.query.token, process.env.Forgot_Secret);
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const user = await User.findOne({ email: decoded.email });
  if (!user) return res.status(404).json({ message: "No user with this email" });

  if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now())
    return res.status(400).json({ message: "Token expired" });

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordExpire = null;
  await user.save();

  res.json({ message: "Password reset successful" });
});
