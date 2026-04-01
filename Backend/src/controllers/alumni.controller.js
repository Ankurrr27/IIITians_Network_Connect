import Alumni from "../models/alumni.model.js";

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizePayload = (body = {}) => ({
  ...body,
  name: body.name?.trim(),
  email: body.email?.trim().toLowerCase(),
  iiit: body.iiit?.trim(),
  generation: body.generation?.trim(),
  branch: body.branch?.trim(),
  currentRole: body.currentRole?.trim(),
  currentCompany: body.currentCompany?.trim(),
  location: body.location?.trim() || "",
  linkedin: body.linkedin?.trim() || "",
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
      "currentRole",
      "currentCompany",
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

export const getAlumni = async (req, res) => {
  try {
    const { search = "", generation = "", iiit = "" } = req.query;
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

    if (search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");
      query.$and.push({
        $or: [
          { name: regex },
          { iiit: regex },
          { branch: regex },
          { currentRole: regex },
          { currentCompany: regex },
          { location: regex },
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
          { currentRole: regex },
          { currentCompany: regex },
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
