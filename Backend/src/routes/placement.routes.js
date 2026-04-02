import express from "express";
import {
  createPlacement,
  getAllPlacements,
  getPlacementByCollege,
  getPlacementByCollegeName,
  upsertPlacementYear,
} from "../controllers/placement.controller.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/", adminAuth, createPlacement);
router.patch("/:placementId/year", adminAuth, upsertPlacementYear);
router.get("/", getAllPlacements);
router.get("/college/:collegeId", getPlacementByCollege);
router.get("/college-name/:name", getPlacementByCollegeName);

export default router;
