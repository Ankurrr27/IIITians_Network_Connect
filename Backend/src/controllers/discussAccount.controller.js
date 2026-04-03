import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DiscussAccount from "../models/discussAccount.model.js";

const DISCUSS_ACCOUNT_DOMAIN = "@iiitiansnetwork";

const normalizeDiscussEmail = (value = "") => {
  const raw = value.trim().toLowerCase();
  if (!raw) return "";

  const handle = raw.includes("@") ? raw.split("@")[0] : raw;
  const safeHandle = handle.replace(/[^a-z0-9._-]/g, "");
  return safeHandle ? `${safeHandle}${DISCUSS_ACCOUNT_DOMAIN}` : "";
};

const sanitizeDiscussAccount = (account) => ({
  id: account._id,
  collegeName: account.collegeName,
  clubName: account.clubName,
  contactName: account.contactName,
  contactPhone: account.contactPhone,
  email: account.email,
  role: account.role,
  isAuthorized: account.isAuthorized,
  badgeLabel: account.badgeLabel,
  lastLogin: account.lastLogin,
  createdAt: account.createdAt,
});

export const registerDiscussAccount = async (req, res) => {
  try {
    const {
      collegeName,
      clubName,
      contactName,
      contactPhone,
      email,
      handle,
      password,
    } = req.body;

    const normalizedEmail = normalizeDiscussEmail(handle || email);

    if (!collegeName || !clubName || !contactName || !normalizedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await DiscussAccount.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ message: "Discuss account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await DiscussAccount.create({
      collegeName,
      clubName,
      contactName,
      contactPhone,
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Discuss account created. Wait for admin authorization.",
      account: sanitizeDiscussAccount(account),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginDiscussAccount = async (req, res) => {
  try {
    const { email, handle, password } = req.body;
    const normalizedEmail = normalizeDiscussEmail(handle || email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Handle & password required" });
    }

    const account = await DiscussAccount.findOne({ email: normalizedEmail });
    if (!account) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, account.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not configured");
    }

    const token = jwt.sign(
      { id: account._id, kind: "discuss_account" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    account.lastLogin = new Date();
    await account.save();

    res.json({
      token,
      account: sanitizeDiscussAccount(account),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiscussAccountMe = async (req, res) => {
  try {
    const account = await DiscussAccount.findById(req.discussAccountId).select("-password");
    if (!account) {
      return res.status(404).json({ message: "Discuss account not found" });
    }

    res.json(sanitizeDiscussAccount(account));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiscussAccounts = async (req, res) => {
  try {
    const accounts = await DiscussAccount.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(accounts.map(sanitizeDiscussAccount));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicDiscussAccounts = async (req, res) => {
  try {
    const accounts = await DiscussAccount.find({ isAuthorized: true })
      .select("collegeName clubName contactName contactPhone email role badgeLabel createdAt lastLogin isAuthorized")
      .sort({ clubName: 1 });

    res.json(accounts.map(sanitizeDiscussAccount));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDiscussAccountByAdmin = async (req, res) => {
  try {
    const account = await DiscussAccount.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Discuss account not found" });
    }

    const nextRole = req.body.role?.trim();
    const nextBadgeLabel = req.body.badgeLabel;
    const nextAuthorized = req.body.isAuthorized;

    if (nextRole && !["club_member", "club_manager", "publisher"].includes(nextRole)) {
      return res.status(400).json({ message: "Invalid discuss role" });
    }

    if (req.body.collegeName !== undefined) account.collegeName = req.body.collegeName;
    if (req.body.clubName !== undefined) account.clubName = req.body.clubName;
    if (req.body.contactName !== undefined) account.contactName = req.body.contactName;
    if (req.body.contactPhone !== undefined) account.contactPhone = req.body.contactPhone;
    if (req.body.handle !== undefined || req.body.email !== undefined) {
      const normalizedEmail = normalizeDiscussEmail(req.body.handle || req.body.email);
      if (!normalizedEmail) {
        return res.status(400).json({ message: "Valid handle required" });
      }

      const duplicate = await DiscussAccount.findOne({
        email: normalizedEmail,
        _id: { $ne: account._id },
      });

      if (duplicate) {
        return res.status(409).json({ message: "Discuss account already exists" });
      }

      account.email = normalizedEmail;
    }
    if (nextRole) account.role = nextRole;
    if (nextBadgeLabel !== undefined) account.badgeLabel = nextBadgeLabel;
    if (nextAuthorized !== undefined) {
      account.isAuthorized =
        nextAuthorized === true || nextAuthorized === "true";
    }

    await account.save();

    res.json({
      message: "Discuss account updated successfully",
      account: sanitizeDiscussAccount(account),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDiscussAccountByAdmin = async (req, res) => {
  try {
    const account = await DiscussAccount.findByIdAndDelete(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Discuss account not found" });
    }

    res.json({ message: "Discuss account removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
