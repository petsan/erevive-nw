import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DashboardDonatePage from "@/app/dashboard/donate/page";

// Mock useAuth
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: { full_name: "Test User" },
    loading: false,
    getToken: () => "fake-token",
  }),
}));

describe("Dashboard Donate Page (/dashboard/donate)", () => {
  it("renders donate heading", () => {
    render(<DashboardDonatePage />);
    expect(screen.getByText("Donate an Item")).toBeInTheDocument();
  });

  it("shows photo upload area", () => {
    render(<DashboardDonatePage />);
    expect(screen.getByText(/click to upload a photo/i)).toBeInTheDocument();
  });

  it("shows file size limit", () => {
    render(<DashboardDonatePage />);
    expect(screen.getByText(/up to 10MB/i)).toBeInTheDocument();
  });
});
