import mongoose from "mongoose";

const siteStatsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global_stats",
    },
    totalViews: {
      type: Number,
      default: 24810,
    },
  },
  { timestamps: true }
);

const SiteStats = mongoose.model("SiteStats", siteStatsSchema);
export default SiteStats;
