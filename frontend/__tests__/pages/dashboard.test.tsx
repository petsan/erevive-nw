import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import DashboardPage from "@/app/dashboard/page";

// Mock useAuth
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: { full_name: "Test User", email: "test@example.com" },
    loading: false,
    getToken: () => "fake-token",
  }),
}));

describe("Dashboard Page (/dashboard)", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);
  });

  it("renders dashboard heading", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("shows welcome message with user name", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Welcome back, Test User/)).toBeInTheDocument();
  });

  it("renders Donate an Item button", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Donate an Item")).toBeInTheDocument();
  });

  it("shows empty state when no items", () => {
    render(<DashboardPage />);
    expect(screen.getByText("No items yet")).toBeInTheDocument();
  });
});
