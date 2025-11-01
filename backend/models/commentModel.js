import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: String,
  sentiment: String,
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
