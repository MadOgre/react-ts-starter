import axios from "axios";

// The shared axios instance every API Function uses.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
