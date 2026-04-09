import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "@/lib/validators";

describe("Login Validator", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "pass123" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-email", password: "pass123" });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("Register Validator", () => {
  const valid = {
    email: "test@example.com",
    password: "secure123",
    confirmPassword: "secure123",
    fullName: "Jane Doe",
  };

  it("accepts valid registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects short password", () => {
    expect(registerSchema.safeParse({ ...valid, password: "abc1", confirmPassword: "abc1" }).success).toBe(false);
  });

  it("rejects password without number", () => {
    expect(registerSchema.safeParse({ ...valid, password: "abcdefgh", confirmPassword: "abcdefgh" }).success).toBe(false);
  });

  it("rejects password without letter", () => {
    expect(registerSchema.safeParse({ ...valid, password: "12345678", confirmPassword: "12345678" }).success).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    expect(registerSchema.safeParse({ ...valid, confirmPassword: "different" }).success).toBe(false);
  });

  it("rejects short name", () => {
    expect(registerSchema.safeParse({ ...valid, fullName: "A" }).success).toBe(false);
  });

  it("accepts optional phone", () => {
    expect(registerSchema.safeParse({ ...valid, phone: "206-555-0100" }).success).toBe(true);
  });
});
