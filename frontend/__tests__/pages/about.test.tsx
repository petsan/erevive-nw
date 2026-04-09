import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutPage from "@/app/about/page";

describe("About Page (/about)", () => {
  it("renders heading", () => {
    render(<AboutPage />);
    expect(screen.getByText("About eRevive NW")).toBeInTheDocument();
  });

  it("renders mission section", () => {
    render(<AboutPage />);
    expect(screen.getByText("Our Mission")).toBeInTheDocument();
  });

  it("renders e-waste stats", () => {
    render(<AboutPage />);
    expect(screen.getByText("50M+")).toBeInTheDocument();
    expect(screen.getByText("17%")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  it("renders what we do section", () => {
    render(<AboutPage />);
    expect(screen.getByText("Refurbish & Donate")).toBeInTheDocument();
    expect(screen.getByText("Certified Recycling")).toBeInTheDocument();
    expect(screen.getByText("Data Security")).toBeInTheDocument();
  });

  it("renders service area with drop-off address", () => {
    render(<AboutPage />);
    const areas = screen.getAllByText("Service Area");
    expect(areas.length).toBeGreaterThan(0);
    expect(screen.getByText(/123 Paper St/)).toBeInTheDocument();
  });

  it("renders CTA", () => {
    render(<AboutPage />);
    const ctas = screen.getAllByText("Donate Now");
    expect(ctas.length).toBeGreaterThan(0);
  });

  it("mentions Seattle-area communities", () => {
    render(<AboutPage />);
    expect(screen.getByText(/Bellevue, Redmond, Kirkland/i)).toBeInTheDocument();
  });
});
