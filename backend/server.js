
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";


dotenv.config(); 

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });

// Schema
const CommentSchema = new mongoose.Schema({
  text: String,
  sentiment: String,
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", CommentSchema);

// Route: Add comment
app.post("/api/comment", async (req, res) => {
  try {
    const { comment } = req.body;

    // Send to Python ML API
    const response = await axios.post("http://localhost:5000/predict", { comment });
    const sentiment = response.data.sentiment;

    // Save to DB
    const newComment = new Comment({ text: comment, sentiment });
    await newComment.save();

    res.json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Route: Get all comments
app.get("/api/comments", async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  res.json(comments);
});
app.delete("/api/comment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Node server running on http://localhost:${PORT}`));
