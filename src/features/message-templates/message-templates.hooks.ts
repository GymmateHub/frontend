import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  messageTemplatesAPI,
  type UpdateMessageTemplateRequest,
} from "./message-templates.api";
import { useToast } from "@/hooks/use-toast";

export type TemplateConfigScope = "platform" | "organisation";

export const messageTemplateKeys = {
  all: ["message-templates"] as const,
  platformList: () => [...messageTemplateKeys.all, "platform"] as const,
  orgList: (orgKey?: string) => [...messageTemplateKeys.all, "organisation", orgKey ?? "current"] as const,
};

export const useMessageTemplates = (scope: TemplateConfigScope, orgKey?: string) => {
  return useQuery({
    queryKey:
      scope === "platform"
        ? messageTemplateKeys.platformList()
        : messageTemplateKeys.orgList(orgKey),
    queryFn: async () => {
      const response =
        scope === "platform"
          ? await messageTemplatesAPI.listPlatformTemplates()
          : await messageTemplatesAPI.listOrganisationTemplates();
      return response.data;
    },
  });
};

export const useSaveMessageTemplate = (scope: TemplateConfigScope, orgKey?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      templateKey,
      data,
    }: {
      templateKey: string;
      data: UpdateMessageTemplateRequest;
    }) => {
      const response =
        scope === "platform"
          ? await messageTemplatesAPI.updatePlatformTemplate(templateKey, data)
          : await messageTemplatesAPI.upsertOrganisationOverride(templateKey, data);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey:
          scope === "platform"
            ? messageTemplateKeys.platformList()
            : messageTemplateKeys.orgList(orgKey),
      });
      toast({
        title: "Template configuration saved",
        description: `${updated.name} (${updated.templateKey}) has been updated.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save template",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useResetMessageTemplate = (scope: TemplateConfigScope, orgKey?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (templateKey: string) => {
      const response =
        scope === "platform"
          ? await messageTemplatesAPI.resetPlatformTemplate(templateKey)
          : await messageTemplatesAPI.deleteOrganisationOverride(templateKey);
      return response.data;
    },
    onSuccess: (reverted) => {
      queryClient.invalidateQueries({
        queryKey:
          scope === "platform"
            ? messageTemplateKeys.platformList()
            : messageTemplateKeys.orgList(orgKey),
      });
      toast({
        title:
          scope === "platform"
            ? "Template reset to factory default"
            : "Organisation override removed",
        description: `${reverted.name} now uses the default configuration.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to reset template",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

