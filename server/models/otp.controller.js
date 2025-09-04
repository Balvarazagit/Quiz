// otp.controller.js
import User from "../models/User.js";
import nodemailer from "nodemailer";

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  const user = await User.findOneAndUpdate(
    { email },
    { otp, otpExpiry: Date.now() + 5 * 60 * 1000 },
    { new: true }
  );

  // Send Email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });

  res.json({ success: true, message: "OTP sent to email" });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ success: true, message: "OTP verified" });
};
