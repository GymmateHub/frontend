import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MembersPage from "./MembersPage";
import { renderWithProviders, lastOf } from "../../test/utils";

const h = vi.hoisted(() => ({ create: vi.fn(), gymId: "gym-1" }));
vi.mock("../../features/members/members.hooks", () => ({
  useMembers: () => ({ data: [], isLoading: false }),
  useActivateMember: () => ({ mutate: vi.fn() }),
  useSuspendMember: () => ({ mutate: vi.fn() }),
  useCancelMember: () => ({ mutate: vi.fn() }),
  useCreateMember: () => ({ mutateAsync: h.create, isPending: false }),
}));
vi.mock("../../features/gyms/useActiveGym", () => ({ useActiveGym: () => ({ gymId: h.gymId }) }));

beforeEach(() => {
  vi.clearAllMocks();
  h.gymId = "gym-1";
  h.create.mockResolvedValue({});
});

async function fillAndSubmit() {
  const user = userEvent.setup();
  renderWithProviders(<MembersPage />);
  await user.click(screen.getByRole("button", { name: "Add Member" }));
  await user.type(screen.getByPlaceholderText("First name"), " Ada ");
  await user.type(screen.getByPlaceholderText("Last name"), "Obi");
  await user.type(screen.getByPlaceholderText("member@email.com"), "ada@example.com");
  await user.click(lastOf(screen.getAllByRole("button", { name: "Add Member" })));
}

describe("MembersPage — Add Member", () => {
  it("sends the gym with the new member (its absence caused the 500)", async () => {
    await fillAndSubmit();

    await waitFor(() =>
      expect(h.create).toHaveBeenCalledWith({
        email: "ada@example.com",
        firstName: "Ada",
        lastName: "Obi",
        phone: undefined,
        gymId: "gym-1",
      })
    );
  });

  it("omits gymId rather than sending an empty string when no gym is known", async () => {
    h.gymId = "";
    await fillAndSubmit();

    await waitFor(() => expect(h.create).toHaveBeenCalled());
    expect(h.create.mock.calls[0][0].gymId).toBeUndefined();
  });

  it("keeps the dialog open when creation fails", async () => {
    h.create.mockRejectedValue(new Error("Gym ID is required"));
    await fillAndSubmit();

    await waitFor(() => expect(h.create).toHaveBeenCalled());
    expect(screen.getByRole("heading", { name: "Add New Member" })).toBeInTheDocument();
  });
});
