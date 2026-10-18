import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError, type AxiosResponse } from "axios";
import SecurityCard, { MIN_PASSWORD_LENGTH, validatePasswordChange } from "./SecurityCard";
import { authAPI } from "../../auth/auth.store";

vi.mock("../../auth/auth.store", () => ({ authAPI: { changePassword: vi.fn() } }));
const toast = vi.hoisted(() => vi.fn());
vi.mock("../../hooks/use-toast", () => ({ useToast: () => ({ toast }) }));

const changePassword = vi.mocked(authAPI.changePassword);

const apiError = (status: number, message: string) =>
  new AxiosError(`Request failed with status code ${status}`, "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    data: { success: false, message },
  } as AxiosResponse);

async function openAndFill(current: string, next: string, confirm: string) {
  const user = userEvent.setup();
  render(<SecurityCard />);
  await user.click(screen.getByRole("button", { name: "Change Password" }));
  await user.type(screen.getByLabelText("Current Password"), current);
  await user.type(screen.getByLabelText("New Password"), next);
  await user.type(screen.getByLabelText("Confirm New Password"), confirm);
  await user.click(screen.getByRole("button", { name: "Update Password" }));
  return user;
}

beforeEach(() => vi.clearAllMocks());

describe("validatePasswordChange", () => {
  const ok = { current: "OldPassword123!", newPass: "NewPassword456!", confirm: "NewPassword456!" };

  it("accepts a valid change", () => expect(validatePasswordChange(ok)).toBeNull());
  it("requires the current password", () => expect(validatePasswordChange({ ...ok, current: "" })).toMatch(/current/i));
  it("enforces the backend minimum length", () => {
    const short = "a".repeat(MIN_PASSWORD_LENGTH - 1);
    expect(validatePasswordChange({ ...ok, newPass: short, confirm: short })).toMatch(String(MIN_PASSWORD_LENGTH));
  });
  it("requires matching confirmation", () => expect(validatePasswordChange({ ...ok, confirm: "different-pass-123" })).toMatch(/match/));
  it("rejects reusing the current password", () =>
    expect(validatePasswordChange({ current: ok.newPass, newPass: ok.newPass, confirm: ok.newPass })).toMatch(/different/));
});

describe("SecurityCard", () => {
  it("calls the API and confirms success only after the server accepts", async () => {
    changePassword.mockResolvedValue({ success: true, message: "ok", data: undefined });
    await openAndFill("OldPassword123!", "NewPassword456!", "NewPassword456!");

    await waitFor(() => expect(changePassword).toHaveBeenCalledWith("OldPassword123!", "NewPassword456!"));
    await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Password changed" })));
    expect(screen.queryByLabelText("Current Password")).not.toBeInTheDocument();
  });

  it("does not call the API when validation fails", async () => {
    await openAndFill("OldPassword123!", "short", "short");

    expect(await screen.findByRole("alert")).toHaveTextContent(/at least 12/);
    expect(changePassword).not.toHaveBeenCalled();
    expect(toast).not.toHaveBeenCalled();
  });

  it("shows the server's message and never claims success when the current password is wrong", async () => {
    changePassword.mockRejectedValue(apiError(400, "Current password is incorrect"));
    await openAndFill("WrongPassword123!", "NewPassword456!", "NewPassword456!");

    expect(await screen.findByRole("alert")).toHaveTextContent("Current password is incorrect");
    expect(toast).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Current Password")).toBeInTheDocument();
  });

  it("clears the form when the dialog is cancelled", async () => {
    const user = userEvent.setup();
    render(<SecurityCard />);
    await user.click(screen.getByRole("button", { name: "Change Password" }));
    await user.type(screen.getByLabelText("Current Password"), "secret-value-123");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Change Password" }));
    expect(screen.getByLabelText("Current Password")).toHaveValue("");
  });

  it("does not offer a fake 2FA flow", () => {
    render(<SecurityCard />);
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enable 2FA" })).toBeDisabled();
  });
});
