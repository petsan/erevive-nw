import { test, expect } from "@playwright/test";

test.describe("API Health", () => {
  test("health endpoint returns healthy", async ({ request }) => {
    const resp = await request.get("/api/v1/health");
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    expect(body.status).toBe("healthy");
  });

  test("admin endpoints require auth", async ({ request }) => {
    const resp = await request.get("/api/v1/admin/items");
    expect(resp.status()).toBe(401);
  });

  test("anonymous donation start works", async ({ request }) => {
    const resp = await request.post("/api/v1/donate/start");
    expect(resp.status()).toBe(201);
    const body = await resp.json();
    expect(body.user_id).toBe("anonymous");
  });

  test("invalid file upload returns 422", async ({ request }) => {
    const start = await request.post("/api/v1/donate/start");
    const item = await start.json();
    const resp = await request.post(`/api/v1/donate/${item.id}/upload`, {
      multipart: {
        file: { name: "evil.txt", mimeType: "text/plain", buffer: Buffer.from("not an image") },
      },
    });
    expect(resp.status()).toBe(422);
  });

  test("security headers present", async ({ request }) => {
    const resp = await request.get("/");
    const headers = resp.headers();
    expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["content-security-policy"]).toContain("default-src");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["server"]).not.toContain("1.27");
  });
});
