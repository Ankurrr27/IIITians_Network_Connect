import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const sanitizeAdmin = (admin) => ({
  id: admin._id,
  email: admin.email,
  role: admin.role,
  lastLogin: admin.lastLogin,
  createdAt: admin.createdAt,
});

const ensureAdminRole = async (admin) => {
  const allAdmins = await Admin.find()
    .select("_id role createdAt")
    .sort({ createdAt: 1, _id: 1 });

  const hasSuperAdmin = allAdmins.some(
    (entry) => entry.role === "super_admin"
  );
  const oldestAdmin = allAdmins[0];
  const shouldBeSuperAdmin =
    !hasSuperAdmin &&
    oldestAdmin &&
    String(oldestAdmin._id) === String(admin._id);

  if (admin.role === "super_admin") {
    return admin;
  }

  const nextRole = shouldBeSuperAdmin ? "super_admin" : admin.role || "admin";

  if (admin.role !== nextRole) {
    admin.role = nextRole;
    await admin.save();
  }

  return admin;
};

// CREATE ADMIN (use once, then disable)
export const createAdmin = async (req, res) => {
  try {
    const { email, password, setupKey } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password)
      return res.status(400).json({ message: "Email & password required" });

    const adminsCount = await Admin.countDocuments();
    const providedSetupKey = req.headers["x-admin-setup-key"] || setupKey;

    if (
      adminsCount > 0 &&
      (!process.env.ADMIN_SETUP_KEY || providedSetupKey !== process.env.ADMIN_SETUP_KEY)
    ) {
      return res.status(403).json({
        message: "Admin creation is disabled",
      });
    }

    if (process.env.ADMIN_SETUP_KEY && providedSetupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({
        message: "Valid setup key required",
      });
    }

    const exists = await Admin.findOne({ email: normalizedEmail });
    if (exists)
      return res.status(409).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: adminsCount === 0 ? "super_admin" : "admin",
    });

    res.status(201).json({
      message: "Admin created",
      admin: sanitizeAdmin(admin),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password)
      return res.status(400).json({ message: "Email & password required" });

    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!process.env.JWT_SECRET)
      throw new Error("JWT_SECRET not configured");

    const resolvedAdmin = await ensureAdminRole(admin);

    const token = jwt.sign(
      { id: resolvedAdmin._id, role: resolvedAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    resolvedAdmin.lastLogin = new Date();
    await resolvedAdmin.save();

    res.json({
      token,
      admin: sanitizeAdmin(resolvedAdmin),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CURRENT ADMIN
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    const resolvedAdmin = await ensureAdminRole(admin);
    res.json(sanitizeAdmin(resolvedAdmin));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAdminBySuperAdmin = async (req, res) => {
  try {
    const currentAdmin = await Admin.findById(req.adminId);
    const resolvedCurrentAdmin = currentAdmin
      ? await ensureAdminRole(currentAdmin)
      : null;
    if (!resolvedCurrentAdmin || resolvedCurrentAdmin.role !== "super_admin") {
      return res.status(403).json({
        message: "Only a super admin can add new admins",
      });
    }

    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const exists = await Admin.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin added successfully",
      admin: sanitizeAdmin(admin),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const currentAdmin = await Admin.findById(req.adminId);
    const resolvedCurrentAdmin = currentAdmin
      ? await ensureAdminRole(currentAdmin)
      : null;
    if (!resolvedCurrentAdmin || resolvedCurrentAdmin.role !== "super_admin") {
      return res.status(403).json({
        message: "Only a super admin can view admins",
      });
    }

    const admins = await Admin.find()
      .select("-password")
      .sort({ role: 1, createdAt: 1 });

    await Promise.all(admins.map((admin) => ensureAdminRole(admin)));

    res.json(admins.map(sanitizeAdmin));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
