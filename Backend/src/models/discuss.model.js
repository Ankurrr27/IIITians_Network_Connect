import mongoose from "mongoose";

const discussSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["announcement", "event", "campaign", "collaboration", "opportunity"],
      default: "announcement",
    },
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
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    actionLink: {
      type: String,
      trim: true,
    },
    banner: {
      public_id: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
      },
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscussAccount",
      required: true,
    },
    accountRole: {
      type: String,
      trim: true,
    },
    isAuthorisedPost: {
      type: Boolean,
      default: false,
    },
    badgeLabel: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Discuss", discussSchema);
