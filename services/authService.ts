import { apiClient } from "./apiClient.js";

export const getSession = () => apiClient.get("/api/me");

export const logout = () => apiClient.post("/api/auth/logout");

export const redeemMembership = (code: string) => apiClient.post("/api/codes/redeem", { code });

export const consumeUsage = () => apiClient.post("/api/usage/consume");
