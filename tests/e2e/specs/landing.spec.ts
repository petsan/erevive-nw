import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("second life");
    await expect(page.locator("text=Start Recycling")).toBeVisible();
    await expect(page.locator("text=How It Works")).toBeVisible();
  });

  test("shows three steps", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Snap a Photo")).toBeVisible();
    await expect(page.locator("text=Review & Submit")).toBeVisible();
    await expect(page.locator("text=Schedule Pickup")).toBeVisible();
  });

  test("shows Seattle service area", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Seattle Metro Area")).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Get Started");
    await expect(page).toHaveURL(/register/);
  });
});
