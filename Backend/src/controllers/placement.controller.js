import Placement from "../models/placement.model.js";
import College from "../models/college.model.js";

/**
 * Create placement doc for a college (ONCE)
 */
export const createPlacement = async (req, res) => {
  try {
    const { college } = req.body;

    if (!college) {
      return res.status(400).json({ error: "College ID is required" });
    }

    // 🔒 1. Ensure college exists
    const collegeExists = await College.findById(college);
    if (!collegeExists) {
      return res.status(400).json({
        error: "Invalid college ID. College does not exist.",
      });
    }

    // 🔒 2. Ensure placement does not already exist
    const existingPlacement = await Placement.findOne({ college });
    if (existingPlacement) {
      return res.status(400).json({
        error: "Placement already exists for this college.",
      });
    }

    // ✅ 3. Safe to create
    const placement = await Placement.create({
      college,
      yearlyPlacements: [],
    });

    res.status(201).json(placement);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Add / Update year-wise placement
 */
export const upsertPlacementYear = async (req, res) => {
  const { placementId } = req.params;
  const { year, placements } = req.body;

  try {
    const placementDoc = await Placement.findById(placementId);
    if (!placementDoc)
      return res.status(404).json({ error: "Placement not found" });

    const idx = placementDoc.yearlyPlacements.findIndex(
      (y) => y.year === year
    );

    if (idx !== -1) {
      placementDoc.yearlyPlacements[idx].placements = placements;
    } else {
      placementDoc.yearlyPlacements.push({ year, placements });
    }

    await placementDoc.save();
    res.json(placementDoc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get placement by college
 */
export const getPlacementByCollegeName = async (req, res) => {
  try {
    const { name } = req.params;

    const college = await College.findOne({
      name: { $regex: name, $options: "i" },
    });

    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    const placement = await Placement.findOne({
      college: college._id,
    }).populate("college", "name location");

    if (!placement) {
      return res.status(404).json({ error: "Placement not found" });
    }

    res.json(placement);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getPlacementByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;

    const placement = await Placement.findOne({
      college: collegeId,
    }).populate("college", "name location");

    if (!placement) {
      return res.status(404).json({ error: "Placement not found" });
    }

    res.json(placement);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
