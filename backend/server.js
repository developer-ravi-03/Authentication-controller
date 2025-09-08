import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

//import routes
import authRoutes from "./routes/auth.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(cookieParser());

// CORS configuration for frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server default port
    credentials: true, // Allow cookies to be sent
  })
);

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
