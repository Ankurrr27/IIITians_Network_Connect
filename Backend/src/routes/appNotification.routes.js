import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  createAdminAppNotification,
  getAdminAppNotifications,
  getPublicActiveAppNotification,
  updateAdminAppNotification,
} from "../controllers/appNotification.controller.js";

const router = express.Router();

router.get("/public-active", getPublicActiveAppNotification);
router.get("/admin", adminAuth, getAdminAppNotifications);
router.post("/admin", adminAuth, createAdminAppNotification);
router.put("/admin/:id", adminAuth, updateAdminAppNotification);

export default router;
