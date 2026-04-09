import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PickupsPage from "@/app/dashboard/pickups/page";

// Mock useAuth
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: { full_name: "Test User" },
    loading: false,
    getToken: () => Promise.resolve("fake-token"),
  }),
}));

describe("Pickups Page (/dashboard/pickups)", () => {
  it("renders schedule pickup heading", () => {
    render(<PickupsPage />);
    expect(screen.getByText("Schedule a Pickup")).toBeInTheDocument();
  });

  it("renders date input", () => {
    render(<PickupsPage />);
    expect(screen.getByText("Pickup Date")).toBeInTheDocument();
  });

  it("renders time window options", () => {
    render(<PickupsPage />);
    expect(screen.getByText(/Morning/i)).toBeInTheDocument();
    expect(screen.getByText(/Afternoon/i)).toBeInTheDocument();
    expect(screen.getByText(/Evening/i)).toBeInTheDocument();
  });

  it("renders ZIP code input", () => {
    render(<PickupsPage />);
    expect(screen.getByText("ZIP Code")).toBeInTheDocument();
  });

  it("renders address input", () => {
    render(<PickupsPage />);
    expect(screen.getByText("Street Address")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<PickupsPage />);
    expect(screen.getByText(/Schedule Free Pickup/i)).toBeInTheDocument();
  });
});
