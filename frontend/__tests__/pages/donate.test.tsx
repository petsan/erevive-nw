import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import DonatePage from "@/app/donate/page";

describe("Donate Page (/donate)", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
  });

  it("renders donate heading", () => {
    render(<DonatePage />);
    expect(screen.getByText("Donate Electronics")).toBeInTheDocument();
  });

  it("shows three donation options", () => {
    render(<DonatePage />);
    expect(screen.getByText("Upload a photo")).toBeInTheDocument();
    expect(screen.getByText("Describe it")).toBeInTheDocument();
    expect(screen.getByText("Just bring it")).toBeInTheDocument();
  });

  it("Just bring it shows address and acceptance note", () => {
    render(<DonatePage />);
    expect(screen.getByText(/123 Paper St/)).toBeInTheDocument();
    expect(screen.getByText(/Some items may not be accepted/i)).toBeInTheDocument();
  });

  it("shows photo upload when Upload option clicked", () => {
    render(<DonatePage />);
    fireEvent.click(screen.getByText("Upload a photo"));
    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
  });

  it("shows grouped item selection when Describe It clicked", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "test-id", user_id: "anonymous", title: "Pending", description: "...", status: "pending", created_at: new Date().toISOString() }),
    } as Response);

    render(<DonatePage />);
    fireEvent.click(screen.getByText("Describe it"));

    // Wait for fetch to resolve
    await screen.findByText("What are you donating?", {}, { timeout: 3000 });

    // Check grouped sections appear (labels are mixed case in DOM, CSS uppercases them)
    expect(screen.getByText("Computers")).toBeInTheDocument();
    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Displays")).toBeInTheDocument();
    expect(screen.getByText("Peripherals")).toBeInTheDocument();
    expect(screen.getByText("Networking")).toBeInTheDocument();
    expect(screen.getByText("Power")).toBeInTheDocument();
    expect(screen.getByText("Infrastructure")).toBeInTheDocument();
    expect(screen.getByText("Entertainment")).toBeInTheDocument();
  });

  it("can select and deselect items", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "test-id", user_id: "anonymous", title: "Pending", description: "...", status: "pending", created_at: new Date().toISOString() }),
    } as Response);

    render(<DonatePage />);
    fireEvent.click(screen.getByText("Describe it"));
    await screen.findByText("What are you donating?", {}, { timeout: 3000 });

    // Items appear as buttons — use getAllByText since "Server" and "Tablet" appear in multiple groups
    const laptopBtns = screen.getAllByText("Laptop");
    fireEvent.click(laptopBtns[0]);
    expect(screen.getByText("1 item selected")).toBeInTheDocument();

    const serverBtns = screen.getAllByText("Server");
    fireEvent.click(serverBtns[0]);
    expect(screen.getByText("2 items selected")).toBeInTheDocument();

    // Deselect — after selection text becomes "✓ Laptop"
    const selectedLaptop = screen.getAllByText(/Laptop/);
    fireEvent.click(selectedLaptop[0]);
    expect(screen.getByText("1 item selected")).toBeInTheDocument();
  });

  it("Next button disabled until items selected", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "test-id", user_id: "anonymous", title: "Pending", description: "...", status: "pending", created_at: new Date().toISOString() }),
    } as Response);

    render(<DonatePage />);
    fireEvent.click(screen.getByText("Describe it"));
    await screen.findByText("What are you donating?", {}, { timeout: 3000 });

    const nextBtn = screen.getByRole("button", { name: /next: contact info/i });
    expect(nextBtn).toBeDisabled();
  });

  it("renders progress bar", () => {
    render(<DonatePage />);
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Receipt")).toBeInTheDocument();
  });
});
