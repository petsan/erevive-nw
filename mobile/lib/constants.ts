import Constants from "expo-constants";

export const APP_NAME = "eRevive NW";

export const API_URL =
  Constants.expoConfig?.extra?.apiUrl || "http://192.168.0.100/api/v1";

export const SEATTLE_ZIP_PREFIXES = ["980", "981"];

export const PICKUP_TIME_WINDOWS = [
  { label: "Morning (9am - 12pm)", value: "9am-12pm" },
  { label: "Afternoon (12pm - 3pm)", value: "12pm-3pm" },
  { label: "Evening (3pm - 6pm)", value: "3pm-6pm" },
] as const;

export const ITEM_CATEGORIES = [
  "Laptop",
  "Desktop",
  "Monitor",
  "Phone",
  "Tablet",
  "Printer",
  "TV",
  "Gaming Console",
  "Networking Equipment",
  "Cables & Accessories",
  "Other",
] as const;

// Colors matching our emerald theme
export const COLORS = {
  primary: "#059669",
  primaryDark: "#047857",
  primaryLight: "#d1fae5",
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
  error: "#dc2626",
  errorBg: "#fef2f2",
  success: "#16a34a",
  warning: "#f59e0b",
} as const;
