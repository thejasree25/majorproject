import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

app.use("/api", commentRoutes);

app.get("/", (req, res) => res.send("Backend is running..."));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Node server running on http://localhost:${PORT}`));
