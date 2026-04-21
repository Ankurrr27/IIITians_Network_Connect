import express from "express";
import { getSiteStats, incrementViews } from "../controllers/siteStats.controller.js";

const router = express.Router();

router.get("/", getSiteStats);
router.post("/increment", incrementViews);

export default router;
