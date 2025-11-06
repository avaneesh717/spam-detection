import express from "express";
import { markSpam, getSpamLikelihood } from "../controllers/spamController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, markSpam);
router.get("/", protect, getSpamLikelihood);

export default router;
