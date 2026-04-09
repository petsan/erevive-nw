import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HowItWorksPage from "@/app/how-it-works/page";

describe("How It Works Page (/how-it-works)", () => {
  it("renders heading", () => {
    render(<HowItWorksPage />);
    expect(screen.getByRole("heading", { level: 1, name: "How It Works" })).toBeInTheDocument();
  });

  it("renders all 4 steps", () => {
    render(<HowItWorksPage />);
    expect(screen.getByText("Tell us what you have")).toBeInTheDocument();
    expect(screen.getByText("Review and submit")).toBeInTheDocument();
    expect(screen.getByText("We pick it up (or you drop off)")).toBeInTheDocument();
    expect(screen.getByText("Responsible recycling")).toBeInTheDocument();
  });

  it("renders what we accept section", () => {
    render(<HowItWorksPage />);
    expect(screen.getByText("What We Accept")).toBeInTheDocument();
    expect(screen.getByText("Laptops")).toBeInTheDocument();
    expect(screen.getByText("Servers")).toBeInTheDocument();
  });

  it("renders not-accepted warning", () => {
    render(<HowItWorksPage />);
    expect(screen.getByText(/Not accepted/i)).toBeInTheDocument();
  });

  it("renders CTA to donate", () => {
    render(<HowItWorksPage />);
    const cta = screen.getAllByText("Donate Now");
    expect(cta.length).toBeGreaterThan(0);
  });

  it("mentions free pickup for Seattle", () => {
    render(<HowItWorksPage />);
    expect(screen.getByText(/Free pickup for Seattle/i)).toBeInTheDocument();
  });
});
