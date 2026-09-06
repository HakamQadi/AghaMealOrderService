import express from "express";
import settingsController from "../controller/SettingsController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public: the app needs currency, fee and open/closed state to render.
router.get("/", settingsController.getPublicSettings);

// Staff: full document and edits.
router.get("/admin", requireAdmin, settingsController.getAdminSettings);
router.patch("/admin", requireAdmin, settingsController.updateSettings);

export default router;
