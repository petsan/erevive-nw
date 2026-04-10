import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test("loads with mission and stats", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("About eRevive NW");
    await expect(page.getByText("Our Mission")).toBeVisible();
    await expect(page.getByText("50M+")).toBeVisible();
    await expect(page.getByText("17%")).toBeVisible();
  });

  test("shows what we do section", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText("Refurbish & Donate")).toBeVisible();
    await expect(page.getByText("Data Security")).toBeVisible();
  });

  test("shows drop-off address", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText("123 Paper St")).toBeVisible();
  });

  test("CTA links to donate", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("main").getByRole("link", { name: "Donate Now" }).click();
    await expect(page).toHaveURL(/\/donate/);
  });
});
