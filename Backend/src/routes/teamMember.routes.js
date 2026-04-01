import express from "express";
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMemberById,
  getTeamMembers,
  updateTeamMember,
} from "../controllers/teamMember.controller.js";
import adminAuth from "../middlewares/adminAuth.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getTeamMembers);
router.get("/:id", getTeamMemberById);
router.post("/", adminAuth, upload.single("photo"), createTeamMember);
router.put("/:id", adminAuth, upload.single("photo"), updateTeamMember);
router.delete("/:id", adminAuth, deleteTeamMember);

export default router;
