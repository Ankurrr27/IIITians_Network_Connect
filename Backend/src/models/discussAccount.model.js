import mongoose from "mongoose";

const discussAccountSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    clubName: {
      type: String,
      required: true,
      trim: true,
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["club_member", "club_manager", "publisher"],
      default: "club_member",
    },
    isAuthorized: {
      type: Boolean,
      default: false,
    },
    badgeLabel: {
      type: String,
      trim: true,
      default: "Pending verification",
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DiscussAccount", discussAccountSchema);
