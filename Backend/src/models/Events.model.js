import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    collegeName: {
      type: String,
      required: true,
      trim: true,
    },

    clubName: {
      type: String,
      default: "",
      trim: true,
    },

    link: {
      type: String,
      default: "",
      trim: true,
    },

    banner: {
      public_id: String,
      url: String,
    },
    sourceDiscussPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discuss",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Event", eventSchema);
