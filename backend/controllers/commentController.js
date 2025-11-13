import axios from "axios";
import Comment from "../models/commentModel.js";

export const analyzeComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: "Comment is required" });
    }

    const mlApiUrl = process.env.ML_API_URL;
    let sentiment = "neutral"; // fallback

    if (mlApiUrl) {
      try {
        const response = await axios.post(
          mlApiUrl,
          { text: comment },
          { headers: { "Content-Type": "application/json" }, timeout: 8000 }
        );
        sentiment = response.data?.sentiment || "neutral";
      } catch (mlErr) {
        console.error("⚠️ ML API error, fallback sentiment used:", mlErr.message);
      }
    } else {
      console.warn("⚠️ ML_API_URL not configured, using fallback sentiment");
    }

    const newComment = new Comment({ text: comment, sentiment });
    await newComment.save();

    res.status(200).json({ sentiment });
  } catch (error) {
    console.error("❌ Error analyzing comment:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error("❌ Error fetching comments:", error.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting comment:", error.message);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
