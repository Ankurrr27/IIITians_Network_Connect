import express from "express";
import {upload} from "../middlewares/upload.middleware.js";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMembers,
  getTeamMemberById,
} from "../controllers/teamMember.controller.js";

const router = express.Router();

router.get("/", getTeamMembers);
router.get("/:id", getTeamMemberById);
router.post("/", upload.single("photo"), createTeamMember);
router.put("/:id", upload.single("photo"), updateTeamMember);
router.delete("/:id", deleteTeamMember);

export default router;
