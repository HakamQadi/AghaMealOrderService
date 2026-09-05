import axios from "axios";

/**
 * Shared API client for the dashboard.
 *
 * Every admin endpoint now requires a Bearer token, so all calls go through
 * here rather than using axios directly — that way a new page cannot forget
 * to authenticate.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // An expired or revoked token should return the user to the login screen
    // rather than leaving the page stuck on a silent failure.
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
