import { useState, useMemo } from "react";
import {
  Mail,
  Bell,
  FileCode2,
  Search,
  RotateCcw,
  Pencil,
  Eye,
  CheckCircle2,
  Sparkles,
  Shield,
  Building2,
  Loader2,
  X,
  Plus,
} from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import { useAuth } from "../../auth/auth.store";
import { hasPermission, PERMISSIONS } from "../../auth/permissions";
import {
  useMessageTemplates,
  useSaveMessageTemplate,
  useResetMessageTemplate,
  parseAvailableVariables,
  renderTemplatePreview,
  type MessageTemplateConfig,
  type MessageTemplateChannel,
  type TemplateConfigScope,
} from "../../features/message-templates";
import {
  cardClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../../components/settings/styles";

type ChannelFilter = "ALL" | MessageTemplateChannel;

export default function MessageTemplatesPage() {
  const { user } = useAuth();
  const isPlatformAdmin = hasPermission(user, PERMISSIONS.PLATFORM_ADMIN);
  const canManageOrg = hasPermission(user, PERMISSIONS.ORG_MANAGE);
  const hasOrgContext = Boolean(user?.actingOrg || (!isPlatformAdmin && canManageOrg));

  // Default to platform scope for Super Admin when not acting inside an org;
  // allow switching between Platform Defaults and Organisation Overrides when acting inside an org.
  const [selectedScope, setSelectedScope] = useState<TemplateConfigScope>(
    isPlatformAdmin && !user?.actingOrg ? "platform" : "organisation"
  );

  const effectiveScope: TemplateConfigScope =
    isPlatformAdmin && !hasOrgContext
      ? "platform"
      : !isPlatformAdmin
      ? "organisation"
      : selectedScope;

  const orgKey = user?.actingOrg?.id ?? "current";

  const { data: templates = [], isLoading } = useMessageTemplates(effectiveScope, orgKey);
  const saveTemplate = useSaveMessageTemplate(effectiveScope, orgKey);
  const resetTemplate = useResetMessageTemplate(effectiveScope, orgKey);

  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyCustomised, setOnlyCustomised] = useState(false);

  // Modal state for editing / previewing a template
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplateConfig | null>(null);
  const [modalTab, setModalTab] = useState<"edit" | "preview">("edit");
  const [subjectOrTitle, setSubjectOrTitle] = useState("");
  const [bodyTemplate, setBodyTemplate] = useState("");
  const [bodyCustomised, setBodyCustomised] = useState(false);
  const [active, setActive] = useState(true);
  const [activeInputField, setActiveInputField] = useState<"subject" | "body">("body");

  const openEditor = (template: MessageTemplateConfig, initialTab: "edit" | "preview" = "edit") => {
    setEditingTemplate(template);
    setModalTab(initialTab);
    setSubjectOrTitle(template.subjectOrTitle);
    setBodyTemplate(template.bodyTemplate ?? "");
    setBodyCustomised(
      template.channel === "NOTIFICATION" ? true : Boolean(template.bodyCustomised)
    );
    setActive(template.active);
    setActiveInputField(template.channel === "EMAIL" && !template.bodyCustomised ? "subject" : "body");
  };

  const closeEditor = () => {
    setEditingTemplate(null);
  };

  const filteredTemplates = useMemo(() => {
    return templates
      .filter((t) => channelFilter === "ALL" || t.channel === channelFilter)
      .filter((t) => {
        if (!onlyCustomised) return true;
        return effectiveScope === "organisation"
          ? t.organisationOverride
          : t.bodyCustomised;
      })
      .filter((t) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.templateKey.toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q) ||
          t.subjectOrTitle.toLowerCase().includes(q)
        );
      });
  }, [templates, channelFilter, onlyCustomised, effectiveScope, searchQuery]);

  const emailCount = useMemo(
    () => templates.filter((t) => t.channel === "EMAIL").length,
    [templates]
  );
  const notificationCount = useMemo(
    () => templates.filter((t) => t.channel === "NOTIFICATION").length,
    [templates]
  );
  const customisedCount = useMemo(
    () =>
      templates.filter((t) =>
        effectiveScope === "organisation" ? t.organisationOverride : t.bodyCustomised
      ).length,
    [templates, effectiveScope]
  );

  const handleInsertVariable = (varName: string) => {
    const token = `{{${varName}}}`;
    if (activeInputField === "subject") {
      setSubjectOrTitle((prev) => `${prev}${prev && !prev.endsWith(" ") ? " " : ""}${token}`);
    } else {
      if (editingTemplate?.channel === "EMAIL" && !bodyCustomised) {
        setBodyCustomised(true);
      }
      setBodyTemplate((prev) => `${prev}${prev && !prev.endsWith(" ") ? " " : ""}${token}`);
    }
  };

  const handleSave = () => {
    if (!editingTemplate || !subjectOrTitle.trim()) return;
    saveTemplate.mutate(
      {
        templateKey: editingTemplate.templateKey,
        data: {
          name: editingTemplate.name,
          description: editingTemplate.description ?? undefined,
          subjectOrTitle: subjectOrTitle.trim(),
          bodyTemplate:
            editingTemplate.channel === "EMAIL" && !bodyCustomised
              ? null
              : bodyTemplate.trim() || null,
          bodyCustomised:
            editingTemplate.channel === "NOTIFICATION" ? true : bodyCustomised,
          active,
        },
      },
      {
        onSuccess: () => {
          closeEditor();
        },
      }
    );
  };

  const handleReset = (template: MessageTemplateConfig) => {
    resetTemplate.mutate(template.templateKey, {
      onSuccess: (reverted) => {
        if (editingTemplate?.templateKey === template.templateKey) {
          setEditingTemplate(reverted);
          setSubjectOrTitle(reverted.subjectOrTitle);
          setBodyTemplate(reverted.bodyTemplate ?? "");
          setBodyCustomised(
            reverted.channel === "NOTIFICATION" ? true : Boolean(reverted.bodyCustomised)
          );
          setActive(reverted.active);
        }
      },
    });
  };

  const editingVariables = useMemo(
    () => parseAvailableVariables(editingTemplate?.availableVariables),
    [editingTemplate]
  );

  return (
    <>
      <PageMeta
        title="Message Templates | GymMateHub"
        description="Configure email and notification message templates"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                Message Templates
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  effectiveScope === "platform"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300"
                    : "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                }`}
              >
                {effectiveScope === "platform" ? (
                  <>
                    <Shield className="h-3.5 w-3.5" />
                    Platform Defaults
                  </>
                ) : (
                  <>
                    <Building2 className="h-3.5 w-3.5" />
                    {user?.actingOrg ? user.actingOrg.name : "Organisation Templates"}
                  </>
                )}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {effectiveScope === "platform"
                ? "Manage default transactional Email and in-app Notification templates across all organisations."
                : "Customise transactional Email subjects/bodies and Notification messages for your organisation."}
            </p>
          </div>

          {/* Scope switcher when a Super Admin is acting inside an organisation */}
          {isPlatformAdmin && hasOrgContext && (
            <div
              className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/[0.04] w-fit"
              role="group"
              aria-label="Configuration scope"
            >
              <button
                type="button"
                onClick={() => setSelectedScope("organisation")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  effectiveScope === "organisation"
                    ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                Organisation
              </button>
              <button
                type="button"
                onClick={() => setSelectedScope("platform")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  effectiveScope === "platform"
                    ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                Platform Defaults
              </button>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total Templates
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white/90 mt-1">
              {templates.length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Email Templates
            </p>
            <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">
              {emailCount}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Notification Templates
            </p>
            <p className="text-2xl font-bold text-warning-600 dark:text-warning-400 mt-1">
              {notificationCount}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {effectiveScope === "organisation" ? "Org Overrides" : "Custom HTML Bodies"}
            </p>
            <p className="text-2xl font-bold text-success-600 dark:text-success-400 mt-1">
              {customisedCount}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/[0.04]">
            {[
              { key: "ALL" as ChannelFilter, label: "All Channels", icon: null },
              {
                key: "EMAIL" as ChannelFilter,
                label: "Email",
                icon: <Mail className="h-4 w-4" />,
              },
              {
                key: "NOTIFICATION" as ChannelFilter,
                label: "Notification",
                icon: <Bell className="h-4 w-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setChannelFilter(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  channelFilter === tab.key
                    ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-1 sm:justify-end">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyCustomised}
                onChange={(e) => setOnlyCustomised(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              {effectiveScope === "organisation" ? "Overrides only" : "Custom HTML only"}
            </label>

            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                aria-label="Search templates"
                placeholder="Search by name, key, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
        </div>

        {/* Templates List */}
        {isLoading ? (
          <div className={`${cardClass} py-16 text-center`} aria-busy="true">
            <Loader2 className="h-7 w-7 text-brand-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading message template configurations...
            </p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className={`${cardClass} py-16 text-center`}>
            <FileCode2 className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
              No matching message templates found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Try clearing your search or channel filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTemplates.map((template) => {
              const variables = parseAvailableVariables(template.availableVariables);
              const isEmail = template.channel === "EMAIL";
              return (
                <div
                  key={template.templateKey}
                  data-testid={`template-card-${template.templateKey}`}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 transition-colors hover:border-gray-300 dark:hover:border-gray-700"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Title & Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            isEmail
                              ? "bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400"
                              : "bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400"
                          }`}
                        >
                          {isEmail ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <Bell className="h-4 w-4" />
                          )}
                        </span>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                          {template.name}
                        </h2>
                        <code className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-600 dark:text-gray-300">
                          {template.templateKey}
                        </code>

                        {effectiveScope === "organisation" && (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              template.organisationOverride
                                ? "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300"
                                : "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400"
                            }`}
                          >
                            {template.organisationOverride
                              ? "Custom Override"
                              : "Platform Default"}
                          </span>
                        )}

                        {isEmail && (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              template.bodyCustomised
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                            }`}
                          >
                            {template.bodyCustomised
                              ? "Custom HTML Body"
                              : `Branded Layout (${template.classpathTemplate ?? "default"}.html)`}
                          </span>
                        )}

                        {!template.active && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-700 dark:bg-error-500/20 dark:text-error-400">
                            Inactive
                          </span>
                        )}
                      </div>

                      {template.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {template.description}
                        </p>
                      )}

                      {/* Configured Subject / Title & Message Preview */}
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 p-3 space-y-1.5">
                        <div className="flex items-baseline gap-2 text-xs">
                          <span className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">
                            {isEmail ? "Subject:" : "Title:"}
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white/90 break-words">
                            {template.subjectOrTitle}
                          </span>
                        </div>
                        {template.bodyTemplate && (
                          <div className="flex items-baseline gap-2 text-xs">
                            <span className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">
                              Body:
                            </span>
                            <span className="text-gray-600 dark:text-gray-300 line-clamp-2 break-words">
                              {template.bodyTemplate}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Available Placeholders */}
                      {variables.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500 mr-1">
                            Variables:
                          </span>
                          {variables.map((variable) => (
                            <span
                              key={variable}
                              className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-xs font-mono text-gray-600 dark:text-gray-300"
                            >
                              {`{{${variable}}}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditor(template, "preview")}
                        className={secondaryButtonClass}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Eye className="h-4 w-4" />
                          Preview
                        </span>
                      </button>

                      {(effectiveScope === "platform" || template.organisationOverride) && (
                        <button
                          type="button"
                          onClick={() => handleReset(template)}
                          disabled={resetTemplate.isPending}
                          className={secondaryButtonClass}
                          title={
                            effectiveScope === "platform"
                              ? "Reset to built-in factory default"
                              : "Remove organisation override and revert to platform default"
                          }
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <RotateCcw className="h-4 w-4" />
                            {effectiveScope === "platform" ? "Reset" : "Revert Override"}
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => openEditor(template, "edit")}
                        className={primaryButtonClass}
                      >
                        <Pencil className="h-4 w-4" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Configure / Preview Modal */}
      <Modal
        isOpen={Boolean(editingTemplate)}
        onClose={closeEditor}
        className="max-w-[720px] p-6 lg:p-8"
      >
        {editingTemplate && (
          <div className="flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {editingTemplate.name}
                  </h3>
                  <code className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-600 dark:text-gray-300">
                    {editingTemplate.templateKey}
                  </code>
                </div>
                {editingTemplate.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {editingTemplate.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeEditor}
                aria-label="Close modal"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tabs (Edit vs Live Preview) */}
            <div className="flex items-center justify-between mt-4 mb-4">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/[0.04]">
                <button
                  type="button"
                  onClick={() => setModalTab("edit")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    modalTab === "edit"
                      ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Configure Template
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("preview")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    modalTab === "preview"
                      ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Live Preview
                </button>
              </div>

              {/* Active Status Switch */}
              <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                Template Active
              </label>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto space-y-5 pr-1">
              {modalTab === "edit" ? (
                <>
                  {/* Interactive Variable Chips */}
                  {editingVariables.length > 0 && (
                    <div className="rounded-xl bg-brand-50/60 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5" />
                          Available Placeholders (click to insert into{" "}
                          {activeInputField === "subject" ? "Subject / Title" : "Body"})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {editingVariables.map((variable) => (
                          <button
                            key={variable}
                            type="button"
                            onClick={() => handleInsertVariable(variable)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-gray-800 border border-brand-200 dark:border-brand-500/30 text-xs font-mono text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                            {`{{${variable}}}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subject or Title */}
                  <div>
                    <label htmlFor="template-subject-input" className={labelClass}>
                      {editingTemplate.channel === "EMAIL"
                        ? "Email Subject Line"
                        : "Notification Title"}
                    </label>
                    <input
                      id="template-subject-input"
                      type="text"
                      value={subjectOrTitle}
                      onFocus={() => setActiveInputField("subject")}
                      onChange={(e) => setSubjectOrTitle(e.target.value)}
                      placeholder={
                        editingTemplate.channel === "EMAIL"
                          ? "e.g. Welcome to {{gymName}}!"
                          : "e.g. New Member Registered"
                      }
                      className={inputClass}
                    />
                  </div>

                  {/* Email Body Mode Selector */}
                  {editingTemplate.channel === "EMAIL" && (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            Customise Email Body Content
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {bodyCustomised
                              ? "Using custom HTML/message body below wrapped in the GymMateHub branded email layout."
                              : `Using the built-in branded template (${editingTemplate.classpathTemplate ?? "default"}.html) with your configured subject line.`}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          aria-label="Customise Email Body Content"
                          checked={bodyCustomised}
                          onChange={(e) => setBodyCustomised(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Body Template Textarea */}
                  {(editingTemplate.channel === "NOTIFICATION" || bodyCustomised) && (
                    <div>
                      <label htmlFor="template-body-input" className={labelClass}>
                        {editingTemplate.channel === "EMAIL"
                          ? "Email Body Content (HTML or Text with {{placeholders}})"
                          : "Notification Message Body"}
                      </label>
                      <textarea
                        id="template-body-input"
                        rows={editingTemplate.channel === "EMAIL" ? 8 : 4}
                        value={bodyTemplate}
                        onFocus={() => setActiveInputField("body")}
                        onChange={(e) => setBodyTemplate(e.target.value)}
                        placeholder={
                          editingTemplate.channel === "EMAIL"
                            ? "<p>Hi {{firstName}}, welcome to {{gymName}}!</p>"
                            : "{{memberName}} ({{membershipType}}) has joined your gym."
                        }
                        className={`${inputClass} font-mono text-xs`}
                      />
                    </div>
                  )}
                </>
              ) : (
                /* Live Preview Tab */
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {editingTemplate.channel === "EMAIL"
                          ? "Rendered Subject Preview"
                          : "Rendered Notification Title"}
                      </span>
                      <p
                        data-testid="preview-subject"
                        className="text-base font-semibold text-gray-800 dark:text-white/90 mt-0.5"
                      >
                        {renderTemplatePreview(subjectOrTitle, editingVariables)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-success-600 dark:text-success-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Sample Data Applied
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {editingTemplate.channel === "EMAIL"
                        ? "Rendered Email Body"
                        : "Rendered Notification Message"}
                    </span>
                    {editingTemplate.channel === "EMAIL" && !bodyCustomised ? (
                      <div className="mt-2 rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
                        Uses the built-in branded HTML template{" "}
                        <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                          templates/{editingTemplate.classpathTemplate}.html
                        </code>{" "}
                        with the subject line above. Toggle{" "}
                        <strong>Customise Email Body Content</strong> in the Configure tab to
                        override the body markup.
                      </div>
                    ) : (
                      <div
                        data-testid="preview-body"
                        className="mt-2 rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
                      >
                        {renderTemplatePreview(bodyTemplate, editingVariables) ||
                          "No body content provided."}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-5 border-t border-gray-100 dark:border-gray-800">
              <div>
                {(effectiveScope === "platform" || editingTemplate.organisationOverride) && (
                  <button
                    type="button"
                    onClick={() => handleReset(editingTemplate)}
                    disabled={resetTemplate.isPending}
                    className={secondaryButtonClass}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <RotateCcw className="h-4 w-4" />
                      {effectiveScope === "platform"
                        ? "Reset to Factory Default"
                        : "Revert to Platform Default"}
                    </span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeEditor}
                  className={secondaryButtonClass}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveTemplate.isPending || !subjectOrTitle.trim()}
                  className={primaryButtonClass}
                >
                  {saveTemplate.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {effectiveScope === "platform"
                    ? "Save Platform Default"
                    : "Save Organisation Template"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

