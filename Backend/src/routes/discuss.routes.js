import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import discussAuth from "../middlewares/discussAuth.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  createDiscussPost,
  deleteDiscussPost,
  deleteMyDiscussPost,
  getAllDiscussPosts,
  getApprovedDiscussPosts,
  getMyDiscussPosts,
  updateDiscussPost,
  updateMyDiscussPost,
} from "../controllers/discuss.controller.js";

const router = express.Router();

router.get("/", getApprovedDiscussPosts);
router.post("/", discussAuth, upload.array("banners", 6), createDiscussPost);
router.get("/mine", discussAuth, getMyDiscussPosts);
router.patch("/mine/:id", discussAuth, upload.array("banners", 6), updateMyDiscussPost);
router.delete("/mine/:id", discussAuth, deleteMyDiscussPost);
router.get("/admin/all", adminAuth, getAllDiscussPosts);
router.patch("/:id", adminAuth, upload.array("banners", 6), updateDiscussPost);
router.delete("/:id", adminAuth, deleteDiscussPost);

export default router;
