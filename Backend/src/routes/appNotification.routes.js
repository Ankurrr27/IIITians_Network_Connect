import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  getAdminAppNotification,
  getPublicActiveAppNotification,
  upsertAdminAppNotification,
} from "../controllers/appNotification.controller.js";

const router = express.Router();

router.get("/public-active", getPublicActiveAppNotification);
router.get("/admin/current", adminAuth, getAdminAppNotification);
router.put("/admin/current", adminAuth, upsertAdminAppNotification);

export default router;
