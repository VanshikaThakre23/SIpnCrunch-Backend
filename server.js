import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch((err)=> console.log(err));

app.use("/api/auth",authRoutes);
app.use("/api/cart",cartRoutes)

app.listen(5000, () => console.log("Server running on port 5000"));