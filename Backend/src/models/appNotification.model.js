import mongoose from "mongoose";

const appNotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: ["milestone", "post", "legacy", "event", "team", "club"],
      default: "milestone",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    showOnEntry: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AppNotification", appNotificationSchema);
