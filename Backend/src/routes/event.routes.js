import express from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../controllers/event.controller.js";
import adminAuth from "../middlewares/adminAuth.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", adminAuth, upload.single("banner"), createEvent);
router.patch("/:id", adminAuth, upload.single("banner"), updateEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.delete("/:id", adminAuth, deleteEvent);

export default router;
