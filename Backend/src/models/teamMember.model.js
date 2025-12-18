import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    /* ================= BASIC INFO ================= */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    roleType: {
      type: String,
      required: true,
      enum: ["EXEC", "LEAD", "MEMBER"],
    },

    iiit: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= MEDIA ================= */
    photo: {
      public_id: String,
      url: {
        type: String,
        required: true,
      },
    },

    /* ================= CONTACT ================= */
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    linkedin: String,
    instagram: String,
    twitter: String,

    /* ================= META ================= */
    team: {
      type: String,
      required: true,
      enum: [
        "Core",
        "Tech",
        "Design",
        "Content",
        "Social Media",
      ],
    },

    year: {
      type: String,
      required: true, // "2025-26"
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TeamMember", teamMemberSchema);
