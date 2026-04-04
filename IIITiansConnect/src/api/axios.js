// api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

api.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("adminToken");
    const hasCustomAuthorization =
      Boolean(req.headers?.Authorization) || Boolean(req.headers?.authorization);

    if (token && !hasCustomAuthorization) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem("adminToken")) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
