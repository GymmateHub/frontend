import { describe, expect, it, vi, beforeEach } from "vitest";
import apiClient from "@/api/axios";
import {
  messageTemplatesAPI,
  parseAvailableVariables,
  renderTemplatePreview,
} from "./message-templates.api";

vi.mock("@/api/axios", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("messageTemplatesAPI & helpers", () => {
  it("parses comma-separated available variables cleanly", () => {
    expect(parseAvailableVariables("firstName, otpCode, expiryMinutes")).toEqual([
      "firstName",
      "otpCode",
      "expiryMinutes",
    ]);
    expect(parseAvailableVariables(null)).toEqual([]);
    expect(parseAvailableVariables("")).toEqual([]);
  });

  it("renders preview text by interpolating {{var}} and ${var} placeholders", () => {
    const rendered = renderTemplatePreview(
      "Hi {{firstName}}, welcome to ${gymName}! Your code is {{otpCode}}.",
      ["firstName", "gymName", "otpCode"]
    );
    expect(rendered).toBe(
      "Hi Alex, welcome to Iron Peak Fitness! Your code is 482910."
    );
  });

  it("calls platform and organisation endpoints with proper paths", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { success: true, message: "OK", data: [] },
    });
    vi.mocked(apiClient.put).mockResolvedValue({
      data: { success: true, message: "Updated", data: {} },
    });
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { success: true, message: "Reset", data: {} },
    });
    vi.mocked(apiClient.delete).mockResolvedValue({
      data: { success: true, message: "Reverted", data: {} },
    });

    await messageTemplatesAPI.listPlatformTemplates();
    expect(apiClient.get).toHaveBeenCalledWith(
      "/configurations/message-templates/platform"
    );

    await messageTemplatesAPI.updatePlatformTemplate("EMAIL_OTP", {
      subjectOrTitle: "Your Code",
      active: true,
    });
    expect(apiClient.put).toHaveBeenCalledWith(
      "/configurations/message-templates/platform/EMAIL_OTP",
      { subjectOrTitle: "Your Code", active: true }
    );

    await messageTemplatesAPI.resetPlatformTemplate("EMAIL_OTP");
    expect(apiClient.post).toHaveBeenCalledWith(
      "/configurations/message-templates/platform/EMAIL_OTP/reset"
    );

    await messageTemplatesAPI.listOrganisationTemplates();
    expect(apiClient.get).toHaveBeenCalledWith("/configurations/message-templates");

    await messageTemplatesAPI.upsertOrganisationOverride("NOTIFICATION_MEMBER_JOINED", {
      subjectOrTitle: "New Member",
      bodyTemplate: "{{memberName}} joined!",
      bodyCustomised: true,
      active: true,
    });
    expect(apiClient.put).toHaveBeenCalledWith(
      "/configurations/message-templates/NOTIFICATION_MEMBER_JOINED",
      {
        subjectOrTitle: "New Member",
        bodyTemplate: "{{memberName}} joined!",
        bodyCustomised: true,
        active: true,
      }
    );

    await messageTemplatesAPI.deleteOrganisationOverride("NOTIFICATION_MEMBER_JOINED");
    expect(apiClient.delete).toHaveBeenCalledWith(
      "/configurations/message-templates/NOTIFICATION_MEMBER_JOINED/override"
    );
  });
});

