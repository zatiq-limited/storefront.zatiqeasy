import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Device-Type": "Web",
    "Application-Type": "Online_Shop",
    // Note: Referer and User-Agent are forbidden headers in browsers
    // They are automatically set by the browser and cannot be overridden
  },
});
