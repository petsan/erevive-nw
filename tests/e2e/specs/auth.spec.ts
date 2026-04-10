import { test, expect } from "@playwright/test";

test.describe("Authentication Pages", () => {
  test("login page has all fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Sign in to your account")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("register page has all fields", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByText("Create your account")).toBeVisible();
    await expect(page.locator("#fullName")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#confirmPassword")).toBeVisible();
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });

  test("login links to register", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("create a new account").click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("register links to login", async ({ page }) => {
    await page.goto("/register");
    await page.getByText("Sign in").click();
    await expect(page).toHaveURL(/\/login/);
  });
});
