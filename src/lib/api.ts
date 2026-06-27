import axios, { AxiosError } from "axios";

const configuredUrl = String(
  import.meta.env.VITE_BASE_URL ?? "http://localhost:3000/api",
).replace(/\/$/, "");

export const API_BASE_URL = configuredUrl.endsWith("/api")
  ? configuredUrl
  : `${configuredUrl}/api`;

export const TOKEN_KEY = "smart-health-admin-token";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getApiError(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { error?: string; message?: string }
      | undefined;
    if (!error.response) {
      return "Cannot connect to Smart Health API. Check the backend URL and Render status.";
    }
    return data?.error ?? data?.message ?? "Request failed. Please try again.";
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}
