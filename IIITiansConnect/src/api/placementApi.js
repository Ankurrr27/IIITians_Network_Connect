import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
});

export const createPlacement = async (collegeId) => {
  return api.post("/placements", { college: collegeId });
};

export const upsertPlacementYear = async (placementId, data) => {
  return api.patch(`/placements/${placementId}/year`, data);
};

export const getPlacementByCollege = async (collegeId) => {
  return api.get(`/placements/college/${collegeId}`);
};

export const getPlacementByCollegeName = (collegeName) =>
  api.get(`/placements/college-name/${encodeURIComponent(collegeName)}`);
