import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("register page has all fields", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("text=Create your account")).toBeVisible();
    await expect(page.locator("#fullName")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#confirmPassword")).toBeVisible();
  });

  test("login page has all fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=Sign in to your account")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  test("login page links to register", async ({ page }) => {
    await page.goto("/login");
    await page.click("text=create a new account");
    await expect(page).toHaveURL(/register/);
  });

  test("register page links to login", async ({ page }) => {
    await page.goto("/register");
    await page.click("text=Sign in");
    await expect(page).toHaveURL(/login/);
  });
});
