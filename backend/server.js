import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",              // local dev
    "https://majorproject-iwb9.vercel.app" // your Vercel frontend
  ],
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));


app.use("/api", commentRoutes);

app.get("/", (req, res) => res.send("Backend is running..."));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Node server running on http://localhost:${PORT}`));
