import { useState } from "react";
import { DollarSign, Users, Calendar, Dumbbell, Download, FileBarChart, Loader2 } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useCurrency } from "../../utils/currency";
import { analyticsAPI } from "../../features/analytics/analytics.api";
import { equipmentAPI, type EquipmentResponse } from "../../features/equipment/equipment.api";
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
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  if (typeof value === "string" || typeof value === "boolean") return String(value);
  return "";
};

const flattenReport = (data: Record<string, unknown>, formatCurrencyFn: (v: number) => string): { metric: string; value: string }[] =>
  Object.entries(data)
    .map(([key, value]) => {
      let displayVal = formatValue(value);
      if (typeof value === "number" && (key.toLowerCase().includes("revenue") || key.toLowerCase().includes("sales") || key.toLowerCase().includes("price"))) {
        displayVal = formatCurrencyFn(value);
      }
      return {
        metric: key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
        value: displayVal,
      };
    })
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
    
  const { format } = useCurrency();
  const { toast } = useToast();

  const [loadingKey, setLoadingKey] = useState<ReportKey | null>(null);
  const [reports, setReports] = useState<Record<ReportKey, GeneratedReport | null>>({
    revenue: null,
    members: null,
    classes: null,
    equipment: null,
  });

  const generateReport = async (key: ReportKey, title: string) => {
    setLoadingKey(key);
    try {
      let rawData: Record<string, unknown> = {};

      if (key === "revenue" || key === "members" || key === "classes") {
        const res = await analyticsAPI.getAllGymsAnalytics();
        const d = (res.data ?? {}) as unknown as Record<string, unknown>;

        if (key === "revenue") {
          rawData = {
            totalRevenue: d.totalRevenue ?? 0,
            monthlyRevenue: d.monthlyRevenue ?? 0,
            growthRate: d.growthRate !== undefined ? `${d.growthRate}%` : "—",
          };
        } else if (key === "members") {
          rawData = {
            totalMembers: d.totalMembers ?? 0,
            activeMembers: d.activeMembers ?? 0,
            newMembersThisMonth: d.newMembersThisMonth ?? 0,
            memberRetentionRate: d.memberRetentionRate !== undefined ? `${d.memberRetentionRate}%` : "—",
          };
        } else {
          rawData = {
            classesThisMonth: d.classesThisMonth ?? 0,
            averageAttendance: d.averageAttendance !== undefined ? `${d.averageAttendance}%` : "—",
          };
        }
      } else if (key === "equipment") {
        const eqRes = await equipmentAPI.getByOrganisation();
        const eqList = eqRes.data || [];
        rawData = {
          totalEquipment: eqList.length,
          operational: eqList.filter((e: EquipmentResponse) => e.status?.toUpperCase() === "OPERATIONAL").length,
          needsMaintenance: eqList.filter((e: EquipmentResponse) => e.status?.toUpperCase() === "NEEDS_MAINTENANCE" || e.status?.toUpperCase() === "MAINTENANCE_DUE").length,
          outOfOrder: eqList.filter((e: EquipmentResponse) => e.status?.toUpperCase() === "OUT_OF_ORDER" || e.status?.toUpperCase() === "BROKEN").length,
        };
      }

      const rows = flattenReport(rawData, (v) => format(v));
      setReports((prev) => ({
        ...prev,
        [key]: { key, title, generatedAt: new Date(), rows },
      }));

      toast({
        title: "Report generated",
        description: `${title} is ready.`,
      });
    } catch {
      toast({
        title: "Failed to generate report",
        description: "Could not fetch report data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingKey(null);
    }
  };

  const reportCards = [
    {
      key: "revenue" as ReportKey,
      title: "Revenue Report",
      description: "Monthly income, subscription revenue, and growth rates",
      icon: DollarSign,
      color: "bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400",
    },
    {
      key: "members" as ReportKey,
      title: "Member Activity Report",
      description: "Member growth, active vs inactive ratio, and retention metrics",
      icon: Users,
      color: "bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400",
    },
    {
      key: "classes" as ReportKey,
      title: "Class Attendance Report",
      description: "Class session counts, attendance averages, and popular times",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    },
    {
      key: "equipment" as ReportKey,
      title: "Equipment Maintenance Report",
      description: "Operational status, maintenance schedules, and repair logs",
      icon: Dumbbell,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    },
  ];

  return (
    <>
      <PageMeta title="Reports | GymMate" description="Export gym business reports" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Reports</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate and export business performance reports</p>
          </div>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportCards.map((card) => {
            const Icon = card.icon;
            const isGenerating = loadingKey === card.key;
            const generated = reports[card.key];

            return (
              <div
                key={card.key}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{card.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.description}</p>
                    </div>
                  </div>
                </div>

                {generated && (
                  <div className="rounded-xl bg-gray-50 dark:bg-white/[0.02] p-3 divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                    {generated.rows.slice(0, 4).map((row) => (
                      <div key={row.metric} className="flex justify-between py-1 text-gray-600 dark:text-gray-300">
                        <span>{row.metric}</span>
                        <span className="font-semibold text-gray-800 dark:text-white">{row.value}</span>
                      </div>
                    ))}
                    <p className="pt-1 text-right text-gray-400 text-[10px]">
                      Generated {generated.generatedAt.toLocaleTimeString()}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => generateReport(card.key, card.title)}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileBarChart className="h-4 w-4" />}
                    {generated ? "Refresh Report" : "Generate Report"}
                  </button>
                  {generated && (
                    <button
                      onClick={() => downloadCsv(card.title, generated.rows)}
                      title="Download CSV"
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
