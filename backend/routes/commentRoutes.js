import express from "express";
import { analyzeComment, getComments, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

router.post("/comment", analyzeComment);
router.get("/comment", getComments);
router.delete("/comment/:id", deleteComment);

export default router;
