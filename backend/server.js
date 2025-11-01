import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Base route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// Routes
app.use("/api/comment", commentRoutes);

// Connect MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sentimentDB";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Node server running on port ${PORT}`);
});
