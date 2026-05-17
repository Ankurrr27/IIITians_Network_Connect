import { Router } from "express";
import { getAdminLogs } from "../controllers/adminLog.controller.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = Router();

// Only authenticated admins can view the logs
router.get("/", adminAuth, getAdminLogs);

export default router;
