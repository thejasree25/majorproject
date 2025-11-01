import axios from "axios";
import Comment from "../models/commentModel.js";

export const analyzeComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ error: "Comment is required" });
    }

    // 🔗 Call ML API
    const mlApiUrl = process.env.ML_API_URL;
    if (!mlApiUrl) {
      throw new Error("ML_API_URL not configured in environment");
    }

    console.log("🔍 Sending to ML API:", mlApiUrl);

   const response = await axios.post(mlApiUrl, { comment });

    const sentiment = response.data.sentiment || "unknown";

    // 💾 Save to MongoDB
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
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
