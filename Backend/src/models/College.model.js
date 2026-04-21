import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // 👇 structured logo object
    photo: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    logo: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    description: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    clubLink: {
      type: String,
      trim: true,
    },

    clubLinks: [
      {
        name: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],

    // 👇 structured gallery (future-proof)
    gallery: [
      {
        public_id: String,
        url: String,
        caption: String,
        category: {
          type: String,
          enum: ["infrastructure", "clubs", "events", "others"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("College", collegeSchema);
