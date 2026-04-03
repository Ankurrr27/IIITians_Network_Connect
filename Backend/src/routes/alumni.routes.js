import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  createAlumni,
  deleteAlumni,
  getAlumni,
  getAlumniRequests,
  updateLegacyProfileByAdmin,
  updateLegacyProfile,
  updateAlumniStatus,
} from "../controllers/alumni.controller.js";

const router = express.Router();

router.get("/admin/requests", adminAuth, getAlumniRequests);
router.patch("/admin/:id", adminAuth, upload.single("photo"), updateLegacyProfileByAdmin);
router.patch("/:id/status", adminAuth, updateAlumniStatus);
router.delete("/:id", adminAuth, deleteAlumni);
router.put("/:id", upload.single("photo"), updateLegacyProfile);
router.get("/", getAlumni);
router.post("/", upload.single("photo"), createAlumni);

export default router;
