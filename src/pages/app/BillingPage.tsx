import { CreditCard, CheckCircle, ArrowUpRight, FileText, Zap } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";

const planFeatures = [
  "Up to 500 members",
  "5 gym locations",
  "Class management",
  "Equipment tracking",
  "Analytics dashboard",
  "Email & SMS campaigns",
];

export default function BillingPage() {
  return (
    <>
      <PageMeta title="Billing | GymMate" description="Manage your subscription and billing" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Billing</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your subscription and payment methods</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
            <ArrowUpRight className="h-4 w-4" />
            Upgrade Plan
          </button>
        </div>

        {/* Current Plan */}
        <div className="rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-500/[0.07] p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h2 className="text-lg font-bold text-gray-800 dark:text-white/90">Professional Plan</h2>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400">Active</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Renews on <span className="font-medium text-gray-700 dark:text-gray-300">July 27, 2026</span></p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90 mt-3">$99<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span></p>
            </div>
            <ul className="space-y-2">
              {planFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-brand-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Payment Methods</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              + Add Card
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-10">
            <CreditCard className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No payment methods</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add a credit or debit card to manage billing</p>
          </div>
        </div>

        {/* Invoices */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Invoices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Download</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <FileText className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No invoices yet</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
