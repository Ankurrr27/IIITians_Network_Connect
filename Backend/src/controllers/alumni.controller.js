import Alumni from "../models/alumni.model.js";
import { ensureLegacyBackfill } from "../services/legacySync.service.js";

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizePayload = (body = {}) => ({
  ...body,
  name: body.name?.trim(),
  email: body.email?.trim().toLowerCase(),
  iiit: body.iiit?.trim(),
  generation: body.generation?.trim(),
  branch: body.branch?.trim(),
  networkPost: body.networkPost?.trim() || "",
  currentRole: body.currentRole?.trim() || "",
  currentCompany: body.currentCompany?.trim() || "",
  location: body.location?.trim() || "",
  linkedin: body.linkedin?.trim() || "",
  instagram: body.instagram?.trim() || "",
  bio: body.bio?.trim() || "",
  graduationYear: Number(body.graduationYear),
});

export const createAlumni = async (req, res) => {
  try {
    const payload = {
      ...normalizePayload(req.body),
      status: "pending",
      reviewedAt: null,
    };

    const requiredFields = [
      "name",
      "email",
      "iiit",
      "generation",
      "branch",
      "graduationYear",
    ];

    const missingField = requiredFields.find((field) => !payload[field]);
    if (missingField) {
      return res.status(400).json({
        message: `${missingField} is required`,
      });
    }

    const alumni = await Alumni.create(payload);
    res.status(201).json({
      message:
        "Your alumni request has been submitted and is waiting for admin approval.",
      alumni,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An alumni profile with this email already exists",
      });
    }

    res.status(400).json({ message: error.message });
  }
};

export const updateLegacyProfile = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({ message: "Legacy profile not found" });
    }

    if (!payload.email || payload.email !== alumni.email) {
      return res.status(403).json({
        message: "Use the same registered email to update this profile.",
      });
    }

    const requiredFields = [
      "name",
      "email",
      "iiit",
      "generation",
      "branch",
      "graduationYear",
    ];

    const missingField = requiredFields.find((field) => !payload[field]);
    if (missingField) {
      return res.status(400).json({
        message: `${missingField} is required`,
      });
    }

    const nextStatus =
      alumni.legacyType === "team_member"
        ? "approved"
        : alumni.status || "approved";

    const updated = await Alumni.findByIdAndUpdate(
      req.params.id,
      {
        ...payload,
        status: nextStatus,
        reviewedAt:
          nextStatus === "approved" ? alumni.reviewedAt || new Date() : null,
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Legacy profile updated successfully.",
      alumni: updated,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAlumni = async (req, res) => {
  try {
    ensureLegacyBackfill();

    const {
      search = "",
      generation = "",
      iiit = "",
      professionalStatus = req.query.placed || "",
      legacyType = "",
      networkPost = "",
    } = req.query;
    const query = {
      $and: [{ $or: [{ status: "approved" }, { status: { $exists: false } }] }],
    };

    if (generation.trim()) {
      query.$and.push({
        generation: new RegExp(`^${escapeRegex(generation.trim())}$`, "i"),
      });
    }

    if (iiit.trim()) {
      query.$and.push({
        iiit: new RegExp(escapeRegex(iiit.trim()), "i"),
      });
    }

    if (legacyType.trim()) {
      query.$and.push({
        legacyType: legacyType.trim(),
      });
    }

    if (networkPost.trim()) {
      query.$and.push({
        networkPost: new RegExp(escapeRegex(networkPost.trim()), "i"),
      });
    }

    if (professionalStatus.trim() === "working") {
      query.$and.push({
        $or: [
          { currentCompany: { $exists: true, $nin: ["", null] } },
          { currentRole: { $exists: true, $nin: ["", null] } },
        ],
      });
    }

    if (professionalStatus.trim() === "open") {
      query.$and.push({
        $and: [
          {
            $or: [
              { currentCompany: { $exists: false } },
              { currentCompany: "" },
              { currentCompany: null },
            ],
          },
          {
            $or: [
              { currentRole: { $exists: false } },
              { currentRole: "" },
              { currentRole: null },
            ],
          },
        ],
      });
    }

    if (search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");
      query.$and.push({
        $or: [
          { name: regex },
          { iiit: regex },
          { branch: regex },
          { networkPost: regex },
          { currentRole: regex },
          { currentCompany: regex },
          { location: regex },
          { "roleHistory.role": regex },
          { "roleHistory.team": regex },
          { "roleHistory.year": regex },
        ],
      });
    }

    const alumni = await Alumni.find(query)
      .sort({ graduationYear: -1, createdAt: -1 })
      .limit(200);

    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alumni" });
  }
};

export const getAlumniRequests = async (req, res) => {
  try {
    ensureLegacyBackfill();

    const { status = "all", search = "" } = req.query;
    const query = { $and: [] };

    if (status.trim() && status !== "all") {
      if (status === "approved") {
        query.$and.push({
          $or: [{ status: "approved" }, { status: { $exists: false } }],
        });
      } else {
        query.$and.push({ status: status.trim() });
      }
    }

    if (search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");
      query.$and.push({
        $or: [
          { name: regex },
          { email: regex },
          { iiit: regex },
          { branch: regex },
          { networkPost: regex },
          { currentRole: regex },
          { currentCompany: regex },
          { "roleHistory.role": regex },
          { "roleHistory.team": regex },
          { "roleHistory.year": regex },
        ],
      });
    }

    const finalQuery = query.$and.length ? query : {};

    const alumni = await Alumni.find(finalQuery).sort({
      status: 1,
      createdAt: -1,
    });

    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alumni requests" });
  }
};

export const updateAlumniStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        message: "Status must be pending, approved, or rejected",
      });
    }

    const alumni = await Alumni.findByIdAndUpdate(
      id,
      {
        status,
        reviewedAt: status === "pending" ? null : new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!alumni) {
      return res.status(404).json({ message: "Alumni request not found" });
    }

    res.json(alumni);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);

    if (!alumni) {
      return res.status(404).json({ message: "Alumni entry not found" });
    }

    res.json({ message: "Alumni entry deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
