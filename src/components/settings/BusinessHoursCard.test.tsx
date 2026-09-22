import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BusinessHoursCard from "./BusinessHoursCard";
import { makeGym } from "../../test/utils";
import { DEFAULT_BUSINESS_HOURS } from "../../utils/businessHours";
import type { GymResponse } from "../../features/gyms/gyms.api";

const mutateAsync = vi.hoisted(() => vi.fn());
vi.mock("../../features/gyms/gyms.hooks", () => ({
  useUpdateGymBusinessSettings: () => ({ mutateAsync, isPending: false }),
}));
const toast = vi.hoisted(() => vi.fn());
vi.mock("../../hooks/use-toast", () => ({ useToast: () => ({ toast }) }));

const gym = (overrides = {}) => makeGym(overrides) as unknown as GymResponse;

beforeEach(() => {
  vi.clearAllMocks();
  mutateAsync.mockResolvedValue({});
});

describe("BusinessHoursCard", () => {
  it("shows the hours stored on the gym, not hard-coded ones", () => {
    const stored = { ...DEFAULT_BUSINESS_HOURS, monday: { open: "05:45", close: "21:15", active: true } };
    render(<BusinessHoursCard gym={gym({ businessHours: JSON.stringify(stored) })} />);

    expect(screen.getByLabelText("Monday opening time")).toHaveValue("05:45");
    expect(screen.getByLabelText("Monday closing time")).toHaveValue("21:15");
  });

  it("saves what the user edited, per day, as JSON", async () => {
    const user = userEvent.setup();
    render(<BusinessHoursCard gym={gym()} />);

    const opening = screen.getByLabelText("Tuesday opening time");
    await user.clear(opening);
    await user.type(opening, "07:30");
    await user.click(screen.getByLabelText("Sunday open"));
    await user.click(screen.getByRole("button", { name: "Save Hours" }));

    expect(mutateAsync).toHaveBeenCalledTimes(1);
    const { id, data } = mutateAsync.mock.calls[0][0];
    expect(id).toBe("gym-1");
    const saved = JSON.parse(data.businessHours);
    expect(saved.tuesday.open).toBe("07:30");
    expect(saved.sunday.active).toBe(true);
    expect(saved.monday).toEqual(DEFAULT_BUSINESS_HOURS.monday);
  });

  it("disables the time inputs of a closed day", async () => {
    const user = userEvent.setup();
    render(<BusinessHoursCard gym={gym()} />);

    expect(screen.getByLabelText("Sunday opening time")).toBeDisabled();
    await user.click(screen.getByLabelText("Sunday open"));
    expect(screen.getByLabelText("Sunday opening time")).toBeEnabled();
  });

  it("refuses to save a day that closes before it opens", async () => {
    const user = userEvent.setup();
    render(<BusinessHoursCard gym={gym()} />);

    const closing = screen.getByLabelText("Monday closing time");
    await user.clear(closing);
    await user.type(closing, "05:00");
    await user.click(screen.getByRole("button", { name: "Save Hours" }));

    expect(mutateAsync).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: "destructive", description: expect.stringMatching(/Monday/) }));
  });
});
