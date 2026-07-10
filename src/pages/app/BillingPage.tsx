import { CreditCard, CheckCircle, ArrowUpRight, FileText, Zap, Loader2, Download } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useCurrentSubscription, useInvoices, usePaymentMethods } from "../../features/billing";

const invoiceStatusStyles: Record<string, string> = {
  paid: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  open: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  draft: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
  void: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
  uncollectible: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
};

export default function BillingPage() {
  const { data: subscription, isLoading: subLoading } = useCurrentSubscription();
  const { data: paymentMethods = [], isLoading: methodsLoading } = usePaymentMethods();
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices();

  const planFeatures = [
    subscription?.maxMembers ? `Up to ${subscription.maxMembers} members` : null,
    subscription?.smsCreditsPerMonth ? `${subscription.smsCreditsPerMonth} SMS credits / month` : null,
    subscription?.emailCreditsPerMonth ? `${subscription.emailCreditsPerMonth} email credits / month` : null,
    subscription?.apiRequestsPerHour ? `${subscription.apiRequestsPerHour} API requests / hour` : null,
  ].filter((f): f is string => f !== null);

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
          {subLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 text-brand-500 animate-spin" />
            </div>
          ) : subscription ? (
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white/90">
                    {subscription.tierDisplayName || subscription.tierName}
                  </h2>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400 capitalize">
                    {subscription.isInTrial ? "Trial" : subscription.status?.toLowerCase()}
                  </span>
                </div>
                {subscription.currentPeriodEnd && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Renews on{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </p>
                )}
                {subscription.isInTrial && subscription.daysRemainingInTrial != null && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {subscription.daysRemainingInTrial} day{subscription.daysRemainingInTrial === 1 ? "" : "s"} left in trial
                  </p>
                )}
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90 mt-3">
                  ${subscription.price ?? 0}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    /{(subscription.billingCycle ?? "month").toLowerCase().replace("ly", "")}
                  </span>
                </p>
                {subscription.maxMembers != null && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {subscription.currentMemberCount ?? 0} of {subscription.maxMembers} members used
                  </p>
                )}
              </div>
              {planFeatures.length > 0 && (
                <ul className="space-y-2">
                  {planFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-4 w-4 text-brand-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No active subscription</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Choose a plan to get started</p>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Payment Methods</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              + Add Card
            </button>
          </div>
          {methodsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 text-brand-500 animate-spin" />
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <CreditCard className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No payment methods</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add a credit or debit card to manage billing</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                    <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90 capitalize">
                      {method.cardBrand ?? method.type} •••• {method.lastFour ?? "????"}
                    </p>
                    {method.expiryMonth && method.expiryYear && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Expires {String(method.expiryMonth).padStart(2, "0")}/{method.expiryYear}
                      </p>
                    )}
                  </div>
                  {method.isDefault && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
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
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {invoicesLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <Loader2 className="h-6 w-6 text-brand-500 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <FileText className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No invoices yet</p>
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">{invoice.invoiceNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {invoice.amount.toFixed(2)} {invoice.currency?.toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${invoiceStatusStyles[invoice.status?.toLowerCase()] ?? invoiceStatusStyles.draft}`}>
                          {invoice.status?.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {invoice.invoicePdfUrl ? (
                          <a
                            href={invoice.invoicePdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            <Download className="h-4 w-4" />
                            PDF
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
