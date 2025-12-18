import TeamMember from "../models/teamMember.model.js";
import cloudinary from "../config/cloudinary.js";

/* =====================================================
   CREATE TEAM MEMBER
   ===================================================== */
export const createTeamMember = async (req, res) => {
  try {
    const {
      name,
      role,
      roleType,
      iiit,
      email,
      team,
      year,
      linkedin,
      instagram,
      twitter,
      order,
    } = req.body;

    // 🔒 Explicit validation
    if (!roleType || !["EXEC", "LEAD", "MEMBER"].includes(roleType)) {
      return res.status(400).json({
        error: "roleType must be EXEC, LEAD, or MEMBER",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Profile photo is required",
      });
    }

    // ☁️ Upload image
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "team-members",
    });

    const member = await TeamMember.create({
      name,
      role,
      roleType,
      iiit,
      email,
      team,
      year,
      linkedin,
      instagram,
      twitter,
      order,
      photo: {
        public_id: upload.public_id,
        url: upload.secure_url,
      },
    });

    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

/* =====================================================
   UPDATE TEAM MEMBER
   ===================================================== */
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await TeamMember.findById(id);
    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }

    // 🔒 roleType validation (YOU WERE MISSING THIS)
    if (
      req.body.roleType &&
      !["EXEC", "LEAD", "MEMBER"].includes(req.body.roleType)
    ) {
      return res.status(400).json({
        error: "Invalid roleType",
      });
    }

    if (req.file) {
      if (member.photo?.public_id) {
        await cloudinary.uploader.destroy(member.photo.public_id);
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "team-members",
      });

      member.photo = {
        public_id: upload.public_id,
        url: upload.secure_url,
      };
    }

    const allowedFields = [
      "name",
      "role",
      "roleType",
      "iiit",
      "email",
      "linkedin",
      "instagram",
      "twitter",
      "team",
      "year",
      "isActive",
      "order",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        member[field] = req.body[field];
      }
    });

    await member.save();
    res.json(member);
  } catch (err) {
    res.status(400).json({
      error: "Failed to update team member",
      details: err.message,
    });
  }
};


/* =====================================================
   DELETE TEAM MEMBER
   ===================================================== */
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await TeamMember.findById(id);
    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }

    if (member.photo?.public_id) {
      await cloudinary.uploader.destroy(member.photo.public_id);
    }

    await member.deleteOne();
    res.json({ message: "Team member deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete team member" });
  }
};

/* =====================================================
   GET TEAM MEMBERS (FILTERABLE)
   ===================================================== */
export const getTeamMembers = async (req, res) => {
  try {
    const { year, team, active } = req.query;

    const filter = {};
    if (year) filter.year = year;
    if (team) filter.team = team;
    if (active !== undefined) filter.isActive = active === "true";

    const members = await TeamMember.find(filter)
      .sort({ order: 1, createdAt: 1 });

    res.json(members);
  } catch {
    res.status(500).json({ error: "Failed to fetch team members" });
  }
};

/* =====================================================
   GET SINGLE TEAM MEMBER
   ===================================================== */
export const getTeamMemberById = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }
    res.json(member);
  } catch {
    res.status(500).json({ error: "Failed to fetch team member" });
  }
};
