import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserMetaCard from "./UserMetaCard";

const h = vi.hoisted(() => ({
  profile: vi.fn(),
  mutateAsync: vi.fn(),
  refreshUserData: vi.fn(),
  setUser: vi.fn(),
  authUser: { userId: "u1" } as { userId?: string; firstName: string; lastName: string; email: string; role: string },
}));
vi.mock("../../features/users/users.hooks", () => ({
  useMyProfile: h.profile,
  useUpdateProfile: () => ({ mutateAsync: h.mutateAsync, isPending: false }),
}));
vi.mock("../../auth/auth.store", () => ({
  useAuth: () => ({ user: h.authUser, refreshUserData: h.refreshUserData }),
  authStorage: { getUser: () => ({ firstName: "Old", lastName: "Name" }), setUser: h.setUser },
}));
const toastError = vi.hoisted(() => vi.fn());
vi.mock("sonner", () => ({ toast: { error: toastError, success: vi.fn() } }));

beforeEach(() => {
  vi.clearAllMocks();
  h.authUser = { userId: "u1", firstName: "Ada", lastName: "Obi", email: "ada@example.com", role: "GYM_OWNER" };
  h.profile.mockReturnValue({ data: { id: "u1", firstName: "Ada", lastName: "Obi", email: "ada@example.com", phone: "", role: "GYM_OWNER" } });
  h.mutateAsync.mockResolvedValue({ firstName: "Adaeze", lastName: "Obi" });
});

async function editAndSave() {
  const user = userEvent.setup();
  render(<UserMetaCard />);
  await user.click(screen.getByRole("button", { name: /Edit Profile/ }));
  const first = screen.getByDisplayValue("Ada");
  await user.clear(first);
  await user.type(first, "Adaeze");
  await user.click(screen.getByRole("button", { name: "Save Changes" }));
}

describe("UserMetaCard — Edit Profile", () => {
  it("saves the edit, updates the signed-in user's name, and closes", async () => {
    await editAndSave();

    await waitFor(() =>
      expect(h.mutateAsync).toHaveBeenCalledWith({ userId: "u1", data: expect.objectContaining({ firstName: "Adaeze", lastName: "Obi" }) })
    );
    expect(h.setUser).toHaveBeenCalledWith(expect.objectContaining({ firstName: "Adaeze" }));
    expect(h.refreshUserData).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByText("Edit Personal Information")).not.toBeInTheDocument());
  });

  it("keeps the dialog open if the API rejects the save", async () => {
    h.mutateAsync.mockRejectedValue(new Error("nope"));
    await editAndSave();

    await waitFor(() => expect(h.mutateAsync).toHaveBeenCalled());
    expect(screen.getByText("Edit Personal Information")).toBeInTheDocument();
    expect(h.refreshUserData).not.toHaveBeenCalled();
  });

  it("tells the user instead of silently doing nothing when the account can't be identified", async () => {
    h.profile.mockReturnValue({ data: undefined });
    h.authUser = { firstName: "Ada", lastName: "Obi", email: "a@b.co", role: "GYM_OWNER" };
    await editAndSave();

    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(h.mutateAsync).not.toHaveBeenCalled();
  });
});
