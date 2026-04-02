import express from "express";
import {
  createAdmin,
  createAdminBySuperAdmin,
  deleteAdminBySuperAdmin,
  getAdmins,
  getMe,
  loginAdmin,
  updateAdminBySuperAdmin,
} from "../controllers/admin.controller.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/create", createAdmin); // TEMPORARY

router.post("/login", loginAdmin);
router.get("/me", adminAuth, getMe);
router.get("/", adminAuth, getAdmins);
router.post("/create-by-super-admin", adminAuth, createAdminBySuperAdmin);
router.patch("/:id", adminAuth, updateAdminBySuperAdmin);
router.delete("/:id", adminAuth, deleteAdminBySuperAdmin);

export default router;
