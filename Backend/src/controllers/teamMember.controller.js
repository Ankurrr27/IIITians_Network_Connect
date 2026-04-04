import TeamMember from "../models/teamMember.model.js";
import Alumni from "../models/alumni.model.js";
import cloudinary from "../config/cloudinary.js";
import { syncTeamMemberToLegacy } from "../services/legacySync.service.js";

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
      aboutText,
      messageText,
      order,
      photoSourceMemberId,
      photoSourceAlumniId,
    } = req.body;

    if (!roleType || !["EXEC", "LEAD", "MEMBER"].includes(roleType)) {
      return res.status(400).json({
        error: "roleType must be EXEC, LEAD, or MEMBER",
      });
    }

    let photoPayload = null;

    if (req.file) {
      photoPayload = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    } else if (photoSourceMemberId) {
      const sourceMember = await TeamMember.findById(photoSourceMemberId);
      if (!sourceMember?.photo?.url) {
        return res.status(400).json({
          error: "Could not reuse the previous member photo",
        });
      }

      photoPayload = {
        public_id: sourceMember.photo.public_id,
        url: sourceMember.photo.url,
      };
    } else if (photoSourceAlumniId) {
      const sourceAlumni = await Alumni.findById(photoSourceAlumniId);
      if (!sourceAlumni?.photo?.url) {
        return res.status(400).json({
          error: "Could not reuse the legacy profile photo",
        });
      }

      photoPayload = {
        public_id: sourceAlumni.photo.public_id,
        url: sourceAlumni.photo.url,
      };
    }

    if (!photoPayload) {
      return res.status(400).json({
        error: "Profile photo is required",
      });
    }

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
      aboutText,
      messageText,
      order,
      photo: photoPayload,
    });

    await syncTeamMemberToLegacy(member);

    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await TeamMember.findById(id);
    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }

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

      member.photo = {
        public_id: req.file.filename,
        url: req.file.path,
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
      "aboutText",
      "messageText",
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
    await syncTeamMemberToLegacy(member);
    res.json(member);
  } catch (err) {
    res.status(400).json({
      error: "Failed to update team member",
      details: err.message,
    });
  }
};

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

export const getTeamMembers = async (req, res) => {
  try {
    const { year, team, active } = req.query;

    const filter = {};
    if (year) filter.year = year;
    if (team) filter.team = team;
    if (active !== undefined) filter.isActive = active === "true";

    const members = await TeamMember.find(filter).sort({ order: 1, createdAt: 1 });

    res.json(members);
  } catch {
    res.status(500).json({ error: "Failed to fetch team members" });
  }
};

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
