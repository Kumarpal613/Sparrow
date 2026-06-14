import { apiClient, API_BASE_URL } from "./client";
import axios from "axios";

export const authApi = {
  signup: async (data) => {
    const response = await apiClient.post("/auth/signup", data);
    return response.data;
  },

  verifySignupOtp: async (data, token) => {
    // Requires Bearer token (from signup response perhaps?)
    const response = await apiClient.post("/auth/signup/verify-otp", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  resendSignupOtp: async (token) => {
    const response = await apiClient.post(
      "/auth/signup/resend-otp",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  login: async (username, password) => {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    params.append("grant_type", "password");

    const response = await apiClient.post("/auth/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  googleLogin: async (idToken) => {
    const response = await apiClient.post("/auth/google-login", {
      id_token: idToken,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  logoutAll: async () => {
    const response = await apiClient.post("/auth/logout_all");
    return response.data;
  },

  requestPasswordRecovery: async (data) => {
    const response = await apiClient.post(
      "/auth/password-recovery/request",
      data,
    );
    return response.data;
  },

  verifyRecoveryOtp: async (data, token) => {
    const response = await apiClient.post(
      "/auth/password-recovery/verify",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  resendRecoveryOtp: async (token) => {
    const response = await apiClient.post(
      "/auth/password-recovery/resend",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await apiClient.post(
      "/auth/password-recovery/reset",
      data,
    );
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },
};
