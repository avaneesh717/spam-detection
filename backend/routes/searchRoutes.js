import express from "express";
import { search, getPerson } from "../controllers/searchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, search);
router.get("/person", protect, getPerson);

export default router;
