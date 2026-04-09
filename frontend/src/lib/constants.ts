export const APP_NAME = "eRevive NW";
export const APP_DESCRIPTION =
  "Recycle your electronics responsibly. Upload a photo, get an instant description, and schedule a free pickup in the Seattle area.";

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
