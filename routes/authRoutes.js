import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

const router = express.Router();

// REGISTER
// REGISTER (do NOT hash here — schema pre('save') will hash)
router.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;
    const password = String(req.body.password || "").trim();
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Create with plain password — pre('save') will hash it
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("register error", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log(`user `, user);
    console.log(`password ${password} ${typeof password}`);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.log(`error ${error}`);
    res.status(500).json({ message: "Login failed", error });
  }
});

export default router;
