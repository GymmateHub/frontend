import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import MessageTemplatesPage from "./MessageTemplatesPage";
import { renderWithProviders } from "../../test/utils";
import type { MessageTemplateConfig } from "../../features/message-templates";

const mockUseAuth = vi.hoisted(() => vi.fn());
const mockUseMessageTemplates = vi.hoisted(() => vi.fn());
const mockSaveMutate = vi.hoisted(() => vi.fn());
const mockResetMutate = vi.hoisted(() => vi.fn());

vi.mock("../../auth/auth.store", () => ({
  useAuth: mockUseAuth,
}));

vi.mock("../../features/message-templates", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../features/message-templates")>();
  return {
    ...actual,
    useMessageTemplates: mockUseMessageTemplates,
    useSaveMessageTemplate: () => ({
      mutate: mockSaveMutate,
      isPending: false,
    }),
    useResetMessageTemplate: () => ({
      mutate: mockResetMutate,
      isPending: false,
    }),
  };
});

const sampleTemplates: MessageTemplateConfig[] = [
  {
    id: "tpl-1",
    organisationId: null,
    templateKey: "EMAIL_WELCOME",
    channel: "EMAIL",
    name: "Welcome Email",
    description: "Sent to newly registered gym owners.",
    subjectOrTitle: "Welcome to {{gymName}}, {{firstName}}!",
    bodyTemplate: null,
    classpathTemplate: "welcome",
    availableVariables: "firstName,gymName",
    bodyCustomised: false,
    active: true,
    organisationOverride: false,
    updatedAt: "2026-11-11T08:00:00Z",
  },
  {
    id: "tpl-2",
    organisationId: "org-1",
    templateKey: "NOTIFICATION_MEMBER_JOINED",
    channel: "NOTIFICATION",
    name: "New Member Joined Notification",
    description: "In-app notification when a member signs up.",
    subjectOrTitle: "New Member Registered",
    bodyTemplate: "{{memberName}} ({{membershipType}}) has joined {{gymName}}.",
    classpathTemplate: null,
    availableVariables: "memberName,membershipType,gymName",
    bodyCustomised: true,
    active: true,
    organisationOverride: true,
    updatedAt: "2026-11-11T08:05:00Z",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("MessageTemplatesPage", () => {
  it("renders organisation templates for a Gym Owner and filters by channel", () => {
    mockUseAuth.mockReturnValue({
      user: {
        role: "GYM_OWNER",
        permissions: ["org:manage", "org:view"],
      },
    });
    mockUseMessageTemplates.mockReturnValue({
      data: sampleTemplates,
      isLoading: false,
    });

    renderWithProviders(<MessageTemplatesPage />);

    expect(
      screen.getByRole("heading", { name: "Message Templates" })
    ).toBeInTheDocument();
    expect(screen.getByText("Organisation Templates")).toBeInTheDocument();
    expect(screen.getByText("Welcome Email")).toBeInTheDocument();
    expect(screen.getByText("New Member Joined Notification")).toBeInTheDocument();
    expect(screen.getByText("Custom Override")).toBeInTheDocument();

    // Filter to Notification channel only
    fireEvent.click(screen.getByRole("button", { name: "Notification" }));
    expect(screen.queryByText("Welcome Email")).not.toBeInTheDocument();
    expect(screen.getByText("New Member Joined Notification")).toBeInTheDocument();
  });

  it("opens the Configure modal, inserts variable chips, previews, and saves", () => {
    mockUseAuth.mockReturnValue({
      user: {
        role: "SUPER_ADMIN",
        permissions: ["platform:admin"],
      },
    });
    mockUseMessageTemplates.mockReturnValue({
      data: sampleTemplates,
      isLoading: false,
    });

    renderWithProviders(<MessageTemplatesPage />);

    expect(screen.getByText("Platform Defaults")).toBeInTheDocument();

    // Open Configure modal for New Member Joined Notification
    const configureButtons = screen.getAllByRole("button", { name: /Configure/i });
    fireEvent.click(configureButtons[1]);

    const titleInput = screen.getByLabelText("Notification Title");
    expect(titleInput).toHaveValue("New Member Registered");

    // Switch to Live Preview tab
    fireEvent.click(screen.getByRole("button", { name: /Live Preview/i }));
    expect(screen.getByTestId("preview-body")).toHaveTextContent(
      "Alex Morgan (Pro All-Access) has joined Iron Peak Fitness."
    );

    // Switch back to Configure tab, update title, and save
    fireEvent.click(screen.getByRole("button", { name: /Configure Template/i }));
    fireEvent.change(screen.getByLabelText("Notification Title"), {
      target: { value: "Welcome New Member!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Platform Default" }));
    expect(mockSaveMutate).toHaveBeenCalledWith(
      {
        templateKey: "NOTIFICATION_MEMBER_JOINED",
        data: {
          name: "New Member Joined Notification",
          description: "In-app notification when a member signs up.",
          subjectOrTitle: "Welcome New Member!",
          bodyTemplate: "{{memberName}} ({{membershipType}}) has joined {{gymName}}.",
          bodyCustomised: true,
          active: true,
        },
      },
      expect.any(Object)
    );
  });
});

