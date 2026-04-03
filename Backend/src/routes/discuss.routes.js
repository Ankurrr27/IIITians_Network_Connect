import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import discussAuth from "../middlewares/discussAuth.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  createDiscussPost,
  deleteDiscussPost,
  getAllDiscussPosts,
  getApprovedDiscussPosts,
  updateDiscussPost,
} from "../controllers/discuss.controller.js";

const router = express.Router();

router.get("/", getApprovedDiscussPosts);
router.post("/", discussAuth, upload.single("banner"), createDiscussPost);
router.get("/admin/all", adminAuth, getAllDiscussPosts);
router.patch("/:id", adminAuth, upload.single("banner"), updateDiscussPost);
router.delete("/:id", adminAuth, deleteDiscussPost);

export default router;
