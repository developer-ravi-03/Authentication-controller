import express from "express";
import {
  login,
  logout,
  signup,
  refreshToken,
  getProfile,
  requestOTP,
  verifyOTP,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

// OTP endpoints
router.post("/request-otp", requestOTP); // expects { email }
router.post("/verify-otp", verifyOTP); // expects { email, otp }

export default router;
