import { Router } from "express";

import { downloadResume, getPortfolioContent, submitMessage } from "../controllers/contentController.js";

const router = Router();

router.get("/portfolio", getPortfolioContent);
router.get("/resume/download", downloadResume);
router.post("/messages", submitMessage);

export default router;
