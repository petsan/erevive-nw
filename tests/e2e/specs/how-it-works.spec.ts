import { test, expect } from "@playwright/test";

test.describe("How It Works Page", () => {
  test("loads with all steps", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("How It Works");
    await expect(page.getByText("Tell us what you have")).toBeVisible();
    await expect(page.getByText("Review and submit")).toBeVisible();
    await expect(page.getByText("We pick it up")).toBeVisible();
    await expect(page.getByText("Responsible recycling")).toBeVisible();
  });

  test("shows accepted items", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page.getByText("What We Accept")).toBeVisible();
    await expect(page.getByText("Laptops", { exact: true })).toBeVisible();
    await expect(page.getByText("Servers", { exact: true })).toBeVisible();
  });

  test("shows not-accepted warning", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page.getByText(/Not accepted/i)).toBeVisible();
  });

  test("CTA links to donate", async ({ page }) => {
    await page.goto("/how-it-works");
    await page.getByRole("main").getByRole("link", { name: "Donate Now" }).click();
    await expect(page).toHaveURL(/\/donate/);
  });
});
