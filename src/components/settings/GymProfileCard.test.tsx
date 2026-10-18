import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GymProfileCard from "./GymProfileCard";
import { makeGym } from "../../test/utils";
import type { GymResponse } from "../../features/gyms/gyms.api";

const mutateAsync = vi.hoisted(() => vi.fn());
vi.mock("../../features/gyms/gyms.hooks", () => ({
  useUpdateGym: () => ({ mutateAsync, isPending: false }),
}));
const toast = vi.hoisted(() => vi.fn());
vi.mock("../../hooks/use-toast", () => ({ useToast: () => ({ toast }) }));

const gym = (overrides = {}) => makeGym(overrides) as unknown as GymResponse;

beforeEach(() => {
  vi.clearAllMocks();
  mutateAsync.mockResolvedValue({});
  URL.createObjectURL = vi.fn(() => "blob:preview");
  URL.revokeObjectURL = vi.fn();
});

describe("GymProfileCard", () => {
  it("is seeded from the gym, not from placeholder text", () => {
    render(<GymProfileCard gym={gym()} />);

    expect(screen.getByLabelText("Gym Name")).toHaveValue("Iron Temple");
    expect(screen.getByLabelText("Address")).toHaveValue("1 Lagos Way");
    expect(screen.getByLabelText("Phone Number")).toHaveValue("+2348000000000");
    expect(screen.getByLabelText("Currency")).toHaveValue("NGN");
  });

  it("sends everything the API requires, echoing values it doesn't edit", async () => {
    const user = userEvent.setup();
    render(<GymProfileCard gym={gym()} />);

    const name = screen.getByLabelText("Gym Name");
    await user.clear(name);
    await user.type(name, "  Iron Temple Ikeja ");
    await user.selectOptions(screen.getByLabelText("Currency"), "USD");
    await user.click(screen.getByRole("button", { name: "Save Profile" }));

    expect(mutateAsync).toHaveBeenCalledWith({
      id: "gym-1",
      data: expect.objectContaining({
        name: "Iron Temple Ikeja",
        contactPhone: "+2348000000000",
        contactEmail: "owner@example.com",
        street: "1 Lagos Way",
        city: "Lagos",
        state: "LA",
        postalCode: "100001",
        country: "Nigeria",
        currency: "USD",
        website: "https://irontemple.example.com",
      }),
    });
  });

  it("cannot save without a name or phone", async () => {
    const user = userEvent.setup();
    render(<GymProfileCard gym={gym()} />);

    await user.clear(screen.getByLabelText("Gym Name"));
    expect(screen.getByRole("button", { name: "Save Profile" })).toBeDisabled();
    await user.type(screen.getByLabelText("Gym Name"), "X");
    await user.clear(screen.getByLabelText("Phone Number"));
    expect(screen.getByRole("button", { name: "Save Profile" })).toBeDisabled();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("opens the file picker from Upload Logo and previews a valid image", async () => {
    const user = userEvent.setup();
    render(<GymProfileCard gym={gym()} />);
    const input = screen.getByTestId("logo-file-input") as HTMLInputElement;
    const clicked = vi.spyOn(input, "click");

    await user.click(screen.getByRole("button", { name: /upload logo/i }));
    expect(clicked).toHaveBeenCalled();

    await user.upload(input, new File(["x"], "logo.png", { type: "image/png" }));
    expect(screen.getByAltText("Gym logo")).toHaveAttribute("src", "blob:preview");
    expect(screen.getByText(/preview only/i)).toBeInTheDocument();
  });

  it("rejects non-images and oversized files", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<GymProfileCard gym={gym()} />);
    const input = screen.getByTestId("logo-file-input");

    await user.upload(input, new File(["x"], "doc.pdf", { type: "application/pdf" }));
    expect(toast).toHaveBeenLastCalledWith(expect.objectContaining({ title: "Unsupported file", variant: "destructive" }));

    const big = new File(["x"], "big.png", { type: "image/png" });
    Object.defineProperty(big, "size", { value: 3 * 1024 * 1024 });
    await user.upload(input, big);
    expect(toast).toHaveBeenLastCalledWith(expect.objectContaining({ title: "Image too large" }));
    expect(screen.queryByAltText("Gym logo")).not.toBeInTheDocument();
  });

  it("saves a pasted logo URL", async () => {
    const user = userEvent.setup();
    render(<GymProfileCard gym={gym()} />);

    await user.type(screen.getByLabelText("Logo"), "https://cdn.example.com/logo.png");
    await user.click(screen.getByRole("button", { name: "Save Profile" }));

    expect(mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ logoUrl: "https://cdn.example.com/logo.png" }) })
    );
  });
});
