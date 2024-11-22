export const API_BASE_URL =
  process.env.VITE_API_BASE_URL ||
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  "https://actimate-takehome.netlify.app/api";
