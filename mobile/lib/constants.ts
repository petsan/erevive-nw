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

export const ITEM_GROUPS = [
  {
    label: "Computers",
    items: ["Desktop Computer", "Laptop", "Server", "Tablet"],
  },
  {
    label: "Components",
    items: [
      "CPU / Processor",
      "Graphics Card / GPU",
      "Hard Drive / SSD",
      "Motherboard",
      "Network Card / NIC",
      "RAM / Memory",
    ],
  },
  {
    label: "Displays",
    items: ["Monitor / Display", "TV / Flat Screen"],
  },
  {
    label: "Mobile Devices",
    items: ["Cell Phone", "Smartwatch / Wearable", "Tablet"],
  },
  {
    label: "Peripherals",
    items: [
      "Camera / Webcam",
      "Dock / Hub / KVM",
      "Keyboard",
      "Mouse",
      "Printer / Scanner",
      "Speakers / Headphones",
    ],
  },
  {
    label: "Networking",
    items: ["Access Point", "Firewall / UTM", "Router / Modem / Switch"],
  },
  {
    label: "Power",
    items: ["Battery / UPS", "Cables / Chargers / Power Supplies", "PDU / Power Strip"],
  },
  {
    label: "Infrastructure",
    items: ["Rack / Shelf / Rails", "Server", "Tape Drive / Backup"],
  },
  {
    label: "Entertainment",
    items: ["Gaming Console", "Streaming Device"],
  },
  {
    label: "Other",
    items: ["Other"],
  },
] as const;

export const ALL_ITEM_TYPES = [...new Set(ITEM_GROUPS.flatMap((g) => g.items))].sort();

export const ITEM_CATEGORIES = ALL_ITEM_TYPES;

export const CONDITION_OPTIONS = [
  { label: "Not sure", value: "" },
  { label: "Working", value: "working" },
  { label: "Damaged / Broken", value: "damaged" },
  { label: "Powers on but untested", value: "unknown" },
] as const;

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
