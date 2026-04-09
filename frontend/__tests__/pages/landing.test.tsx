import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "@/app/page";

describe("Landing Page (/)", () => {
  it("renders the hero headline", () => {
    render(<Home />);
    expect(screen.getByText(/second life/i)).toBeInTheDocument();
  });

  it("renders the Donate Now CTA", () => {
    render(<Home />);
    const links = screen.getAllByRole("link", { name: /donate now/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", "/donate");
  });

  it("renders the three steps section", () => {
    render(<Home />);
    expect(screen.getByText("Snap a Photo")).toBeInTheDocument();
    expect(screen.getByText("Review & Submit")).toBeInTheDocument();
    expect(screen.getByText("Schedule Pickup")).toBeInTheDocument();
  });

  it("renders Seattle service area section", () => {
    render(<Home />);
    expect(screen.getByText(/Seattle Metro Area/i)).toBeInTheDocument();
  });

  it("renders header with brand name", () => {
    render(<Home />);
    const brands = screen.getAllByText("eRevive");
    expect(brands.length).toBeGreaterThanOrEqual(1);
  });

  it("renders footer", () => {
    render(<Home />);
    expect(screen.getByText(/Free pickup service available/i)).toBeInTheDocument();
  });
});
