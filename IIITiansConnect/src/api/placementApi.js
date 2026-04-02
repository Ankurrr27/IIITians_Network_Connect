// src/api/placementApi.js
import api from "./axios";

export const getAllPlacements = () => {
  return api.get("/placements");
};

// Create placement document (one-time per college)
export const createPlacement = (collegeId) => {
  return api.post("/placements", { college: collegeId });
};

// Add or update placement data for a year
export const upsertPlacementYear = (placementId, data) => {
  return api.patch(`/placements/${placementId}/year`, data);
};

// Get placement by college ID
export const getPlacementByCollege = (collegeId) => {
  return api.get(`/placements/college/${collegeId}`);
};

// Get placement by college name (search)
export const getPlacementByCollegeName = (collegeName) => {
  return api.get(
    `/placements/college-name/${encodeURIComponent(collegeName)}`
  );
};
