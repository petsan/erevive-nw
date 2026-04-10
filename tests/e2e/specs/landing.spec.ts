import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("loads with hero section and CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("second life");
    await expect(page.getByRole("link", { name: /donate now/i }).first()).toBeVisible();
  });

  test("shows three-step process", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Snap a Photo" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Review & Submit" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Schedule Pickup" })).toBeVisible();
  });

  test("shows Seattle service area", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Seattle Metro Area/i)).toBeVisible();
  });

  test("header navigation links work", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "How It Works" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "About" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign In" }).first()).toBeVisible();
  });

  test("Donate Now navigates to /donate", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /donate now/i }).first().click();
    await expect(page).toHaveURL(/\/donate/);
  });
});
