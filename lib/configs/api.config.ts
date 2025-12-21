import axios from "axios";

// Determine if we're in local development environment
const isLocalDevelopment =
  process.env.NEXT_PUBLIC_BASE_URL?.includes(".test") ||
  process.env.NEXT_PUBLIC_BASE_URL?.includes("localhost");

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Device-Type": "Web",
    "Application-Type": "Online_Shop",
    Referer: "https://shop.zatiqeasy.com",
    "User-Agent":
      typeof window !== "undefined"
        ? window.navigator.userAgent
        : "NextJS Server",
  },
});