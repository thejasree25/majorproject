import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); 

const app = express();
app.use(express.json());
app.use(cors());

// 🧠 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });

// 🗂️ Schema & Model
const CommentSchema = new mongoose.Schema({
  text: String,
  sentiment: String,
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", CommentSchema);

// ✏️ Route: Add Comment
app.post("/api/comment", async (req, res) => {
  try {
    const { comment } = req.body;

    // Send to Python ML API for prediction
    const response = await axios.post(`${process.env.ML_API_URL}/predict`, { comment });
    const sentiment = response.data.sentiment;

    // Save result in MongoDB
    const newComment = new Comment({ text: comment, sentiment });
    await newComment.save();

    res.json(newComment);
  } catch (error) {
    console.error("❌ Error in /api/comment:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 📜 Route: Get All Comments
app.get("/api/comments", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error("❌ Error in /api/comments:", error.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// 🗑️ Route: Delete a Comment
app.delete("/api/comment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting comment:", error.message);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// 🏠 Default Route (Homepage)
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Major Project API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            color: #333;
            text-align: center;
            margin-top: 100px;
          }
          h1 {
            color: #2E86C1;
          }
          p {
            font-size: 18px;
          }
          a {
            color: #2E86C1;
            text-decoration: none;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>🚀 Major Project Backend</h1>
        <p>✅ Server is live and running successfully on Render!</p>
        <p>Available API Routes:</p>
        <ul style="list-style: none;">
          <li><a href="/api/comments">GET /api/comments</a> — Fetch all comments</li>
          <li>POST /api/comment — Add a new comment (with sentiment)</li>
          <li>DELETE /api/comment/:id — Delete a comment</li>
        </ul>
      </body>
    </html>
  `);
});

// 🚀 Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Node server running on http://localhost:${PORT}`));
