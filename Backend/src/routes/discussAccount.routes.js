import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import discussAuth from "../middlewares/discussAuth.js";
import {
  deleteDiscussAccountByAdmin,
  getDiscussAccountMe,
  getDiscussAccounts,
  getPublicDiscussAccounts,
  loginDiscussAccount,
  registerDiscussAccount,
  updateDiscussAccountByAdmin,
} from "../controllers/discussAccount.controller.js";

const router = express.Router();

router.post("/register", registerDiscussAccount);
router.post("/login", loginDiscussAccount);
router.get("/me", discussAuth, getDiscussAccountMe);
router.get("/public", getPublicDiscussAccounts);

router.get("/admin/all", adminAuth, getDiscussAccounts);
router.patch("/admin/:id", adminAuth, updateDiscussAccountByAdmin);
router.delete("/admin/:id", adminAuth, deleteDiscussAccountByAdmin);

export default router;
