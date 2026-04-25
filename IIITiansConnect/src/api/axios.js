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
  async (error) => {
    const config = error.config;

    // Handle 429 Too Many Requests with Exponential Backoff
    if (error.response && error.response.status === 429 && (!config._retryCount || config._retryCount < 3)) {
      config._retryCount = (config._retryCount || 0) + 1;
      
      const retryAfterHeader = error.response.headers['retry-after'];
      const waitTime = retryAfterHeader 
        ? parseInt(retryAfterHeader, 10) * 1000 
        : Math.pow(2, config._retryCount) * 1000;
      
      console.warn(`[Axios] Rate limited. Retrying attempt ${config._retryCount} in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return api(config);
    }

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
