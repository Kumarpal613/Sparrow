import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const isAuthEndpoint = (url) =>
  url &&
  ["/auth/login", "/auth/signup", "/auth/refresh"].some((path) =>
    url.includes(path),
  );

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && !isAuthEndpoint(config.url)) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;
      try {
        const rs = await apiClient.post("/auth/refresh", {});

        if (rs.data.access_token) {
          localStorage.setItem("access_token", rs.data.access_token);
        }

        return apiClient(originalRequest);
      } catch (_error) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  },
);
