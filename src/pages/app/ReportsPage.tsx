import { useState } from "react";
import { FileText, DollarSign, Users, Calendar, Dumbbell, Download, FileBarChart, Loader2 } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../auth/auth.store";
import { analyticsAPI } from "../../features/analytics/analytics.api";
import { equipmentAPI } from "../../features/equipment/equipment.api";
import { useToast } from "../../hooks/use-toast";

type ReportKey = "revenue" | "members" | "classes" | "equipment";

interface GeneratedReport {
  key: ReportKey;
  title: string;
  generatedAt: Date;
  rows: { metric: string; value: string }[];
}

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string" || typeof value === "boolean") return String(value);
  return "";
};

const flattenReport = (data: Record<string, unknown>): { metric: string; value: string }[] =>
  Object.entries(data)
    .map(([key, value]) => ({
      metric: key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
      value: formatValue(value),
    }))
    .filter((row) => row.value !== "");

const downloadCsv = (title: string, rows: { metric: string; value: string }[]) => {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv = ["Metric,Value", ...rows.map((r) => `${escape(r.metric)},${escape(r.value)}`)].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export default function ReportsPage() {
  const { user } = useAuth();
  const gymId = user?.gymId ?? "";
  const { toast } = useToast();

  const [loadingKey, setLoadingKey] = useState<ReportKey | null>(null);
  const [reports, setReports] = useState<GeneratedReport[]>([]);

  const fetchReport = async (key: ReportKey): Promise<Record<string, unknown>> => {
    switch (key) {
      case "revenue": {
        const response = await analyticsAPI.getRevenueAnalytics(gymId);
        return response.data;
      }
      case "members": {
        const response = await analyticsAPI.getMemberAnalytics(gymId);
        return response.data;
      }
      case "classes": {
        const response = await analyticsAPI.getClassAnalytics(gymId);
        return response.data;
      }
      case "equipment": {
        const response = await equipmentAPI.getByGym(gymId);
        const items = response.data;
        return {
          totalEquipment: items.length,
          active: items.filter((e: { status?: string }) => e.status === "ACTIVE" || e.status === "AVAILABLE").length,
          underMaintenance: items.filter((e: { status?: string }) => e.status === "MAINTENANCE").length,
        };
      }
    }
  };

  const reportCategories: {
    key: ReportKey;
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    description: string;
  }[] = [
    {
      key: "revenue",
      icon: <DollarSign className="h-6 w-6 text-success-600 dark:text-success-400" />,
      iconBg: "bg-success-100 dark:bg-success-500/20",
      title: "Revenue Report",
      description: "Monthly and yearly revenue breakdown, payment trends, and financial summaries.",
    },
    {
      key: "members",
      icon: <Users className="h-6 w-6 text-brand-600 dark:text-brand-400" />,
      iconBg: "bg-brand-100 dark:bg-brand-500/20",
      title: "Member Report",
      description: "Member growth, retention rates, subscription plans, and demographic insights.",
    },
    {
      key: "classes",
      icon: <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      iconBg: "bg-blue-100 dark:bg-blue-500/20",
      title: "Class Attendance Report",
      description: "Class popularity, attendance rates, peak hours, and instructor performance.",
    },
    {
      key: "equipment",
      icon: <Dumbbell className="h-6 w-6 text-warning-600 dark:text-warning-400" />,
      iconBg: "bg-warning-100 dark:bg-warning-500/20",
      title: "Equipment Report",
      description: "Equipment utilization, maintenance history, downtime tracking, and cost analysis.",
    },
  ];

  const handleGenerate = async (key: ReportKey, title: string, exportCsv = false) => {
    if (!gymId) {
      toast({
        title: "No gym selected",
        description: "A gym must be associated with your account to generate reports.",
        variant: "destructive",
      });
      return;
    }
    setLoadingKey(key);
    try {
      const data = await fetchReport(key);
      const rows = flattenReport(data);
      const report: GeneratedReport = { key, title, generatedAt: new Date(), rows };
      setReports((prev) => [report, ...prev.filter((r) => r.key !== key)]);
      if (exportCsv) downloadCsv(title, rows);
    } catch {
      toast({
        title: `Error generating ${title.toLowerCase()}`,
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <>
      <PageMeta title="Reports | GymMate" description="Generate and download business reports" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Reports</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate and export business reports</p>
          </div>
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reportCategories.map((report) => (
            <div key={report.key} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${report.iconBg}`}>
                  {report.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{report.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{report.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => handleGenerate(report.key, report.title)}
                  disabled={loadingKey !== null}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loadingKey === report.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileBarChart className="h-4 w-4" />}
                  Generate
                </button>
                <button
                  onClick={() => handleGenerate(report.key, report.title, true)}
                  disabled={loadingKey !== null}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Generated Reports */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">Recent Reports</h2>
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No reports generated yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Generated reports will appear here for download</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reports.map((report) => (
                <div key={report.key} className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{report.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Generated {report.generatedAt.toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => downloadCsv(report.title, report.rows)}
                      className="flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {report.rows.map((row) => (
                          <tr key={row.metric}>
                            <td className="px-5 py-2.5 text-sm text-gray-500 dark:text-gray-400">{row.metric}</td>
                            <td className="px-5 py-2.5 text-sm font-medium text-gray-800 dark:text-white/90">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
