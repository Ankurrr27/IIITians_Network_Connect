import SiteStats from "../models/SiteStats.model.js";
import Event from "../models/Events.model.js";
import College from "../models/College.model.js";
import Alumni from "../models/alumni.model.js";

export const getSiteStats = async (req, res) => {
  try {
    const [stats, totalEvents, totalColleges, photoStats, totalAlumni] = await Promise.all([
      SiteStats.findOne({ key: "global_stats" }),
      Event.countDocuments(),
      College.countDocuments(),
      College.aggregate([
        { $project: { galleryCount: { $size: { $ifNull: ["$gallery", []] } } } },
        { $group: { _id: null, total: { $sum: "$galleryCount" } } }
      ]),
      Alumni.countDocuments({ $or: [{ status: "approved" }, { status: { $exists: false } }] })
    ]);

    const totalPhotos = photoStats[0]?.total || 0;

    let baseStats = stats;
    if (!baseStats) {
      baseStats = await SiteStats.create({ key: "global_stats", totalViews: 24810 });
    }

    res.json({
      totalViews: baseStats.totalViews,
      totalEvents,
      totalPhotos,
      totalColleges,
      totalAlumni
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const incrementViews = async (req, res) => {
  try {
    let stats = await SiteStats.findOne({ key: "global_stats" });
    if (!stats) {
      stats = await SiteStats.create({ key: "global_stats", totalViews: 24811 });
    } else {
      stats.totalViews += 1;
      await stats.save();
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

