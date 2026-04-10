import { test, expect } from "@playwright/test";

test.describe("Donate Flow", () => {
  test("shows three donation options", async ({ page }) => {
    await page.goto("/donate");
    await expect(page.getByText("Donate Electronics")).toBeVisible();
    await expect(page.getByText("Upload a photo")).toBeVisible();
    await expect(page.getByText("Describe it")).toBeVisible();
    await expect(page.getByText("Just bring it")).toBeVisible();
  });

  test("Just bring it shows address and warning", async ({ page }) => {
    await page.goto("/donate");
    await expect(page.getByText("123 Paper St")).toBeVisible();
    await expect(page.getByText(/Some items may not be accepted/i)).toBeVisible();
  });

  test("Describe it flow: select items and submit", async ({ page }) => {
    await page.goto("/donate");

    // Click Describe it
    await page.getByText("Describe it").click();

    // Wait for item groups to load
    await expect(page.getByText("What are you donating?")).toBeVisible({ timeout: 5000 });

    // Check groups are visible
    await expect(page.getByText("Computers")).toBeVisible();
    await expect(page.getByText("Components")).toBeVisible();

    // Select Laptop (first occurrence)
    await page.getByRole("button", { name: /^Laptop$/ }).first().click();
    await expect(page.getByText("1 item selected")).toBeVisible();

    // Select Mouse (unique in Peripherals)
    await page.getByRole("button", { name: /^Mouse$/ }).first().click();
    await expect(page.getByText("2 items selected")).toBeVisible();

    // Fill description
    await page.getByPlaceholder(/Brand, model/).fill("Dell Latitude, about 3 years old");

    // Click next
    await page.getByRole("button", { name: /Next: Contact Info/i }).click();

    // Contact page
    await expect(page.getByText("leave blank to donate anonymously")).toBeVisible();

    // Fill contact info
    await page.getByPlaceholder("Jane Doe").fill("Test User");
    await page.getByPlaceholder("you@example.com").fill("test@test.com");

    // Submit
    await page.getByRole("button", { name: /Submit Donation/i }).click();

    // Receipt
    await expect(page.getByText("Test User")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Laptop/)).toBeVisible();
    await expect(page.getByText(/Mouse/)).toBeVisible();
  });

  test("Upload photo option shows file picker", async ({ page }) => {
    await page.goto("/donate");
    await page.getByText("Upload a photo").click();
    await expect(page.getByText(/Click to upload/i)).toBeVisible();
    await expect(page.getByText("Back")).toBeVisible();
  });

  test("Donate another item after receipt", async ({ page }) => {
    await page.goto("/donate");
    await page.getByText("Describe it").click();
    await expect(page.getByText("What are you donating?")).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: "Cell Phone" }).first().click();
    await page.getByRole("button", { name: /Next/i }).click();
    await page.getByRole("button", { name: /Skip/i }).click();
    await expect(page.getByText("Donate Another Item")).toBeVisible();
    await page.getByRole("button", { name: "Donate Another Item" }).click();
    await expect(page.getByText("Upload a photo")).toBeVisible();
  });
});
