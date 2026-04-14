import { Router } from "express";

import {
  bootstrapAdmin,
  getAuthStatus,
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from "../controllers/authController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/status", getAuthStatus);
router.post("/bootstrap", bootstrapAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/me", requireAdmin, getCurrentAdmin);

export default router;
