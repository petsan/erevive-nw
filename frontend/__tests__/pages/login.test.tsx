import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoginPage from "@/app/login/page";

describe("Login Page (/login)", () => {
  it("renders sign in heading", () => {
    render(<LoginPage />);
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("renders email input", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders password input", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders sign in button", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("has link to register page", () => {
    render(<LoginPage />);
    expect(screen.getByText(/create a new account/i)).toHaveAttribute("href", "/register");
  });

  it("renders brand name", () => {
    render(<LoginPage />);
    expect(screen.getByText("eRevive")).toBeInTheDocument();
  });
});
