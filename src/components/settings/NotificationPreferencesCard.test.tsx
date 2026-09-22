import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotificationPreferencesCard from "./NotificationPreferencesCard";

const toast = vi.hoisted(() => vi.fn());
vi.mock("../../hooks/use-toast", () => ({ useToast: () => ({ toast }) }));

beforeEach(() => vi.clearAllMocks());
afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("NotificationPreferencesCard", () => {
  it("persists toggles and restores them on the next visit", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<NotificationPreferencesCard gymId="g1" />);

    const classChanges = screen.getByRole("switch", { name: "Class changes" });
    expect(classChanges).toHaveAttribute("aria-checked", "false");
    await user.click(classChanges);
    await user.click(screen.getByRole("button", { name: "Save Preferences" }));
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Notification preferences saved" }));
    unmount();

    render(<NotificationPreferencesCard gymId="g1" />);
    expect(screen.getByRole("switch", { name: "Class changes" })).toHaveAttribute("aria-checked", "true");
  });

  it("does not persist unsaved toggles", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<NotificationPreferencesCard gymId="g1" />);
    await user.click(screen.getByRole("switch", { name: "Payment confirmations" }));
    unmount();

    render(<NotificationPreferencesCard gymId="g1" />);
    expect(screen.getByRole("switch", { name: "Payment confirmations" })).toHaveAttribute("aria-checked", "true");
  });

  it("says so when the browser refuses storage instead of claiming success", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const user = userEvent.setup();
    render(<NotificationPreferencesCard gymId="g1" />);
    await user.click(screen.getByRole("button", { name: "Save Preferences" }));

    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: "destructive" }));
    expect(toast).not.toHaveBeenCalledWith(expect.objectContaining({ title: "Notification preferences saved" }));
  });
});
