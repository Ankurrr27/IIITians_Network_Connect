import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  createAlumni,
  deleteAlumni,
  getAlumni,
  getAlumniRequests,
  updateAlumniStatus,
} from "../controllers/alumni.controller.js";

const router = express.Router();

router.get("/admin/requests", adminAuth, getAlumniRequests);
router.patch("/:id/status", adminAuth, updateAlumniStatus);
router.delete("/:id", adminAuth, deleteAlumni);
router.get("/", getAlumni);
router.post("/", createAlumni);

export default router;
