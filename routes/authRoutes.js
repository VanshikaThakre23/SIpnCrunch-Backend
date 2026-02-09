// import express from "express";
// //import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/UserModel.js";


// const router = express.Router();

// // REGISTER
// // REGISTER (do NOT hash here — schema pre('save') will hash)
// router.post("/register", async (req, res) => {
//   try {
//     console.log("Request body:", req.body); // log what frontend sends

//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       console.log("Validation failed: Missing fields");
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       console.log("User already exists:", email);
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // const hashedPassword = await bcrypt.hash(password, 10);
//     // console.log("Password hashed successfully");

//     const newUser = await User.create({ name, email, password});
//     console.log("User created:", newUser);

//     res.status(201).json({ message: "Registered successfully", user: newUser });
//   } catch (error) {
//     console.error("Registration error:", error); // <-- full error
//     res.status(500).json({ message: "Registration failed" });
//   }
// });


// // LOGIN
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     console.log(`user `, user);
//     console.log(`password ${password} ${typeof password}`);

//     //const isMatch = await bcrypt.compare(password, user.password);
//     const isMatch = await user.matchPassword(password);


//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });
//     res.json({ message: "Login successful", token, user });
//   } catch (error) {
//     console.log(`error ${error}`);
//     res.status(500).json({ message: "Login failed", error });
//   }
// });

// export default router;



import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const router = express.Router();

/* ===================== REGISTER ===================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // IMPORTANT: password is plain here, schema will hash it
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "Registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ===================== LOGIN ===================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
