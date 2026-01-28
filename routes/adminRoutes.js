import express from "express";
import User from "./models/User.js";
import authMiddleware, { isAdmin } from "./middleware/authMiddleware.js";

const router = express.Router();

/*
---------------------------------
ADMIN: GET ALL USERS
---------------------------------
GET /api/admin/users
*/
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;
