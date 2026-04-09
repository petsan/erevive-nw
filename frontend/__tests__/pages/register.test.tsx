import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RegisterPage from "@/app/register/page";

describe("Register Page (/register)", () => {
  it("renders create account heading", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("renders phone field as optional", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it("renders create account button", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("has link to login page", () => {
    render(<RegisterPage />);
    expect(screen.getByText(/sign in/i)).toHaveAttribute("href", "/login");
  });
});
