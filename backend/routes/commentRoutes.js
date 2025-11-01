import express from "express";
import { analyzeComment, getAllComments, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

// Get all comments
router.get("/comments", getAllComments);

// Analyze a new comment
router.post("/comment", analyzeComment);

// Delete a comment
router.delete("/comment/:id", deleteComment);

export default router;
