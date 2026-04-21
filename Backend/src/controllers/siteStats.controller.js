import SiteStats from "../models/SiteStats.model.js";

export const getSiteStats = async (req, res) => {
  try {
    let stats = await SiteStats.findOne({ key: "global_stats" });
    if (!stats) {
      stats = await SiteStats.create({ key: "global_stats", totalViews: 24810 });
    }
    res.json(stats);
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
