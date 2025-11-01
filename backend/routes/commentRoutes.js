import express from "express";
import { analyzeComment, getComments, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

router.post("/", analyzeComment);
router.get("/", getComments);
router.delete("/:id", deleteComment);

export default router;
