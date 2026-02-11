import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

/* =========================
   REGISTER
========================= */
export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({
      message: "Please provide email, name, and password",
    });
  }

  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const tempUser = {
    name,
    email,
    password: hashPassword,
  };

  const otp = Math.floor(100000 + Math.random() * 900000);

  const activationToken = jwt.sign(
    {
      user: tempUser,
      otp,
    },
    process.env.Activation_Secret,
    {
      expiresIn: "5m",
    }
  );

  const data = { name, otp };

  try {
    await sendMail(email, "E-Learning OTP Verification", data);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to send OTP email",
      error: error.message,
    });
  }

  res.status(200).json({
    message: "OTP sent to your email",
    activationToken,
  });
});

/* =========================
   VERIFY USER
========================= */
export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  const verify = jwt.verify(
    activationToken,
    process.env.Activation_Secret
  );

  if (!verify) {
    return res.status(400).json({
      message: "OTP Expired",
    });
  }

  if (verify.otp !== Number(otp)) {
    return res.status(400).json({
      message: "Wrong OTP",
    });
  }

  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
    role: "user", // default role
  });

  res.json({
    message: "User Registered Successfully",
  });
});

/* =========================
   LOGIN
========================= */
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "No user with this email",
    });
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return res.status(400).json({
      message: "Wrong password",
    });
  }

  // ✅ include role in token
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.Jwt_Sec,
    { expiresIn: "15d" }
  );

  res.json({
    message: `Welcome back ${user.name}`,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/* =========================
   MY PROFILE
========================= */
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json({ user });
});

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "No user with this email",
    });
  }

  const token = jwt.sign(
    { email },
    process.env.Forgot_Secret,
    { expiresIn: "5m" }
  );

  const data = { email, token };

  await sendForgotMail("E-Learning Reset Password", data);

  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
  await user.save();

  res.json({
    message: "Reset password link sent to your email",
  });
});

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = TryCatch(async (req, res) => {
  const decodedData = jwt.verify(
    req.query.token,
    process.env.Forgot_Secret
  );

  const user = await User.findOne({ email: decodedData.email });

  if (!user) {
    return res.status(404).json({
      message: "No user with this email",
    });
  }

  if (!user.resetPasswordExpire) {
    return res.status(400).json({
      message: "Token expired",
    });
  }

  if (user.resetPasswordExpire < Date.now()) {
    return res.status(400).json({
      message: "Token expired",
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  user.password = hashedPassword;
  user.resetPasswordExpire = null;

  await user.save();

  res.json({
    message: "Password reset successful",
  });
});
