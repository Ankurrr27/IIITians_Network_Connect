import mongoose from "mongoose";

const roleHistorySchema = new mongoose.Schema(
  {
    role: {
      type: String,
      trim: true,
      default: "",
    },
    team: {
      type: String,
      trim: true,
      default: "",
    },
    year: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const alumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    iiit: {
      type: String,
      required: true,
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
    },
    generation: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    networkPost: {
      type: String,
      trim: true,
      default: "",
    },
    currentRole: {
      type: String,
      trim: true,
      default: "",
    },
    currentCompany: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },
    instagram: {
      type: String,
      trim: true,
      default: "",
    },
    photo: {
      public_id: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
      },
    },
    twitter: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    legacyType: {
      type: String,
      enum: ["alumni", "team_member"],
      default: "alumni",
      index: true,
    },
    sourceTeamMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamMember",
      default: null,
      index: true,
    },
    roleHistory: {
      type: [roleHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

alumniSchema.index({
  name: "text",
  iiit: "text",
  branch: "text",
  currentRole: "text",
  currentCompany: "text",
  generation: "text",
});

export default mongoose.model("Alumni", alumniSchema);
