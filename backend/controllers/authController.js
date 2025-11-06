import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  try {
    const { name, phone, email, password, city, country } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({ name, phone, email, password, city, country, otp });

  
    let emailSent = false;
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your account",
        text: `Your OTP is ${otp}`,
      });
      emailSent = true;
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
    }

    const message = emailSent
      ? "User registered successfully. Check your email for OTP."
      : `User registered successfully. Your OTP is: ${otp} (Email service unavailable - showing OTP here for development)`;

    res.json({ message, otp: emailSent ? undefined : otp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const ok = await User.verifyOtp(email, otp);
    if (!ok) return res.status(400).json({ message: "Invalid email or OTP" });

    res.json({ message: "Account verified successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await User.comparePassword(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

   
    if (!user.verified) return res.status(403).json({ message: "Please verify your account" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
