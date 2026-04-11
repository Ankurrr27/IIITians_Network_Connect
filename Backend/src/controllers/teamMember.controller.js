import TeamMember from "../models/teamMember.model.js";
import Alumni from "../models/alumni.model.js";
import cloudinary from "../config/cloudinary.js";
import { syncTeamMemberToLegacy } from "../services/legacySync.service.js";

const mergeSocialHandles = (primary = {}, fallback = {}) => ({
  linkedin: primary.linkedin?.trim() || fallback.linkedin?.trim() || "",
  instagram: primary.instagram?.trim() || fallback.instagram?.trim() || "",
  twitter: primary.twitter?.trim() || fallback.twitter?.trim() || "",
});

const mergeCareerFields = (primary = {}, fallback = {}) => ({
  currentCompany:
    primary.currentCompany?.trim() || fallback.currentCompany?.trim() || "",
  location: primary.location?.trim() || fallback.location?.trim() || "",
});

const resolveExistingSocialHandles = async (email = "", currentId = null) => {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return { linkedin: "", instagram: "", twitter: "" };

  const [existingTeamMember, existingLegacy] = await Promise.all([
    TeamMember.findOne({
      email: normalizedEmail,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    }).sort({
      year: -1,
      order: 1,
      updatedAt: -1,
      createdAt: -1,
    }),
    Alumni.findOne({ email: normalizedEmail }).sort({
      updatedAt: -1,
      createdAt: -1,
    }),
  ]);

  return mergeSocialHandles(existingTeamMember || {}, existingLegacy || {});
};

const resolveExistingCareerFields = async (email = "", currentId = null) => {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return { currentCompany: "", location: "" };

  const [existingTeamMember, existingLegacy] = await Promise.all([
    TeamMember.findOne({
      email: normalizedEmail,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    }).sort({
      year: -1,
      order: 1,
      updatedAt: -1,
      createdAt: -1,
    }),
    Alumni.findOne({ email: normalizedEmail }).sort({
      updatedAt: -1,
      createdAt: -1,
    }),
  ]);

  return mergeCareerFields(existingTeamMember || {}, existingLegacy || {});
};

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
      currentCompany,
      location,
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
    const inferredHandles = await resolveExistingSocialHandles(email);
    const inferredCareerFields = await resolveExistingCareerFields(email);

    const member = await TeamMember.create({
      name,
      role,
      roleType,
      iiit,
      email,
      team,
      year,
      ...mergeSocialHandles({ linkedin, instagram, twitter }, inferredHandles),
      ...mergeCareerFields(
        { currentCompany, location },
        inferredCareerFields
      ),
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
      "currentCompany",
      "location",
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

    if (req.body.email !== undefined || req.body.linkedin !== undefined || req.body.instagram !== undefined || req.body.twitter !== undefined) {
      const inferredHandles = await resolveExistingSocialHandles(
        req.body.email ?? member.email,
        member._id
      );
      const mergedHandles = mergeSocialHandles(
        {
          linkedin: req.body.linkedin ?? member.linkedin,
          instagram: req.body.instagram ?? member.instagram,
          twitter: req.body.twitter ?? member.twitter,
        },
        inferredHandles
      );

      member.linkedin = mergedHandles.linkedin;
      member.instagram = mergedHandles.instagram;
      member.twitter = mergedHandles.twitter;
    }

    if (req.body.email !== undefined || req.body.currentCompany !== undefined || req.body.location !== undefined) {
      const inferredCareerFields = await resolveExistingCareerFields(
        req.body.email ?? member.email,
        member._id
      );
      const mergedCareerFields = mergeCareerFields(
        {
          currentCompany: req.body.currentCompany ?? member.currentCompany,
          location: req.body.location ?? member.location,
        },
        inferredCareerFields
      );

      member.currentCompany = mergedCareerFields.currentCompany;
      member.location = mergedCareerFields.location;
    }

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
