import { FileText, DollarSign, Users, Calendar, Dumbbell, Download, FileBarChart } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";

const reportCategories = [
  {
    icon: <DollarSign className="h-6 w-6 text-success-600 dark:text-success-400" />,
    iconBg: "bg-success-100 dark:bg-success-500/20",
    title: "Revenue Report",
    description: "Monthly and yearly revenue breakdown, payment trends, and financial summaries.",
  },
  {
    icon: <Users className="h-6 w-6 text-brand-600 dark:text-brand-400" />,
    iconBg: "bg-brand-100 dark:bg-brand-500/20",
    title: "Member Report",
    description: "Member growth, retention rates, subscription plans, and demographic insights.",
  },
  {
    icon: <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    iconBg: "bg-blue-100 dark:bg-blue-500/20",
    title: "Class Attendance Report",
    description: "Class popularity, attendance rates, peak hours, and instructor performance.",
  },
  {
    icon: <Dumbbell className="h-6 w-6 text-warning-600 dark:text-warning-400" />,
    iconBg: "bg-warning-100 dark:bg-warning-500/20",
    title: "Equipment Report",
    description: "Equipment utilization, maintenance history, downtime tracking, and cost analysis.",
  },
];

export default function ReportsPage() {
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
            <div key={report.title} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 flex flex-col gap-4">
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
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
                  <FileBarChart className="h-4 w-4" />
                  Generate
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium transition-colors">
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Reports */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">Recent Reports</h2>
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No reports generated yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Generated reports will appear here for download</p>
          </div>
        </div>
      </div>
    </>
  );
}
