import { describe, it, expect } from "vitest";
import {
  ALL_ITEM_TYPES,
  CONDITION_OPTIONS,
  ITEM_GROUPS,
  PICKUP_TIME_WINDOWS,
  SEATTLE_ZIP_PREFIXES,
} from "@/lib/constants";

describe("Constants", () => {
  it("SEATTLE_ZIP_PREFIXES covers Seattle metro", () => {
    expect(SEATTLE_ZIP_PREFIXES).toContain("980");
    expect(SEATTLE_ZIP_PREFIXES).toContain("981");
  });

  it("PICKUP_TIME_WINDOWS has 3 windows", () => {
    expect(PICKUP_TIME_WINDOWS).toHaveLength(3);
    expect(PICKUP_TIME_WINDOWS[0].value).toBe("9am-12pm");
    expect(PICKUP_TIME_WINDOWS[1].value).toBe("12pm-3pm");
    expect(PICKUP_TIME_WINDOWS[2].value).toBe("3pm-6pm");
  });

  it("ITEM_GROUPS has 10 groups", () => {
    expect(ITEM_GROUPS.length).toBe(10);
  });

  it("each ITEM_GROUP has a label and non-empty items", () => {
    for (const group of ITEM_GROUPS) {
      expect(group.label).toBeTruthy();
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("items within each group are alphabetically sorted", () => {
    for (const group of ITEM_GROUPS) {
      const sorted = [...group.items].sort();
      expect(group.items).toEqual(sorted);
    }
  });

  it("ALL_ITEM_TYPES is globally sorted", () => {
    const sorted = [...ALL_ITEM_TYPES].sort();
    expect(ALL_ITEM_TYPES).toEqual(sorted);
  });

  it("ALL_ITEM_TYPES has no duplicates", () => {
    const unique = new Set(ALL_ITEM_TYPES);
    expect(unique.size).toBe(ALL_ITEM_TYPES.length);
  });

  it("ALL_ITEM_TYPES includes key items", () => {
    expect(ALL_ITEM_TYPES).toContain("Laptop");
    expect(ALL_ITEM_TYPES).toContain("Server");
    expect(ALL_ITEM_TYPES).toContain("Cell Phone");
    expect(ALL_ITEM_TYPES).toContain("Hard Drive / SSD");
    expect(ALL_ITEM_TYPES).toContain("RAM / Memory");
  });

  it("CONDITION_OPTIONS has 4 options", () => {
    expect(CONDITION_OPTIONS).toHaveLength(4);
    expect(CONDITION_OPTIONS[0].value).toBe("");
    expect(CONDITION_OPTIONS[1].value).toBe("working");
    expect(CONDITION_OPTIONS[2].value).toBe("damaged");
    expect(CONDITION_OPTIONS[3].value).toBe("unknown");
  });
});
