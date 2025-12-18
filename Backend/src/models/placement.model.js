import mongoose from "mongoose";

const branchPlacementSchema = new mongoose.Schema(
  {
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    highestPackage: {
      type: Number,
      required: true,
    },
    averagePackage: {
      type: Number,
      required: true,
    },
    lowestPackage: {
      type: Number,
      required: true,
    },
    placementPercentage: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    studentsPlaced: {
      type: Number,
      required: true,
    },
    totalStudents: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const yearlyPlacementSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    placements: {
      type: [branchPlacementSchema],
      required: true,
    },
  },
  { _id: false }
);

const placementSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      unique: true, // ONE placement document per college
    },
    yearlyPlacements: {
      type: [yearlyPlacementSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Placement", placementSchema);
