// This file is used to define the configuration of the API.
let env;
try {
  env = process.env;
  if (!env.VITE_API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined in process.env");
  }
} catch (error) {
  try {
    env = (import.meta as any).env;
    if (!env.VITE_API_BASE_URL) {
      throw new Error("VITE_API_BASE_URL is not defined in import.meta");
    }
  } catch (error) {
    console.error("Error importing environment variables:", error);
    env = {
      VITE_API_BASE_URL: "https://actimate-takehome.netlify.app/api",
    };
  }
}

export const API_BASE_URL = env.VITE_API_BASE_URL;
