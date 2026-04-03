import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  addCollegeGallery,
  createCollege,
  getCollegeById,
  getCollegeLogo,
  getColleges,
  updateCollege,
  updateCollegeLogo,
  updateCollegePhoto,
} from "../controllers/college.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", adminAuth, createCollege);
router.get("/", getColleges);

router.get("/:id/logo", getCollegeLogo);
router.get("/:id", getCollegeById);

router.patch("/:id", adminAuth, updateCollege);

router.patch(
  "/:id/photo",
  adminAuth,
  upload.single("photo"),
  updateCollegePhoto
);

router.patch(
  "/:id/logo",
  adminAuth,
  upload.single("logo"),
  updateCollegeLogo
);

router.patch(
  "/:id/gallery",
  adminAuth,
  upload.array("images", 10),
  addCollegeGallery
);

export default router;
