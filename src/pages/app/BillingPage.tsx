import { useState } from "react";
import { CreditCard, CheckCircle, FileText, Zap, Download, Plus, Trash2 } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import AddCardModal from "../../components/billing/AddCardModal";
import UpgradePlanModal, { PLAN_CURRENCY } from "../../components/billing/UpgradePlanModal";
import {
  useCurrentSubscription,
  useInvoices,
  usePaymentMethods,
  useRemovePaymentMethod,
} from "../../features/billing";
import { formatCurrency } from "../../utils/currency";

const cardClass = "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03]";

const formatDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString() : "—");

export default function BillingPage() {
  const { data: subscription, isLoading: subLoading, isError: subError } = useCurrentSubscription();
  const { data: paymentMethods = [], isLoading: methodsLoading } = usePaymentMethods();
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices();
  const removeMethod = useRemovePaymentMethod();

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const planFeatures = subscription
    ? [
        subscription.maxMembers ? `Up to ${subscription.maxMembers} members` : "Unlimited members",
        subscription.smsCreditsPerMonth ? `${subscription.smsCreditsPerMonth} SMS credits / month` : null,
        subscription.emailCreditsPerMonth ? `${subscription.emailCreditsPerMonth} email credits / month` : null,
        subscription.apiRequestsPerHour ? `${subscription.apiRequestsPerHour} API requests / hour` : null,
      ].filter((f): f is string => !!f)
    : [];

  const planName = subscription?.tierDisplayName ?? subscription?.tierName;

  return (
    <>
      <PageMeta title="Billing | GymMate" description="Manage your subscription and billing" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Billing</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your subscription and payment methods</p>
          </div>
          <button
            type="button"
            onClick={() => setIsUpgradeOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Zap className="h-4 w-4" />
            Upgrade Plan
          </button>
        </div>

        {/* Current plan */}
        <section className={`${cardClass} p-6 lg:p-8`} aria-labelledby="current-plan-heading">
          {subLoading ? (
            <div className="animate-pulse space-y-3" aria-busy="true">
              <div className="h-5 w-24 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-7 w-48 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          ) : subError || !subscription ? (
            <div>
              <h2 id="current-plan-heading" className="text-lg font-semibold text-gray-800 dark:text-white/90">No active subscription</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                We couldn't find a subscription for your organisation. Choose a plan with Upgrade Plan.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400 uppercase tracking-wider">
                    Current plan
                  </span>
                  <h2 id="current-plan-heading" className="text-2xl font-bold text-gray-800 dark:text-white/90 mt-2">{planName}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Status: <span className="text-success-600 dark:text-success-400 font-medium capitalize">{subscription.status?.toLowerCase()}</span>
                    {subscription.isInTrial && subscription.trialEnd ? ` · Trial ends ${formatDate(subscription.trialEnd)}` : ""}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  {subscription.price != null && (
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                      {formatCurrency(subscription.price, PLAN_CURRENCY)}
                      <span className="text-base font-normal text-gray-400">/{subscription.billingCycle?.toLowerCase() === "yearly" ? "yr" : "mo"}</span>
                    </p>
                  )}
                  {subscription.currentPeriodEnd && (
                    <p className="text-xs text-gray-400 mt-1">
                      {subscription.cancelAtPeriodEnd ? "Ends" : "Renews"} {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  )}
                </div>
              </div>

              {planFeatures.length > 0 && (
                <div className="pt-6">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-4">Included Plan Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {planFeatures.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-success-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Payment methods */}
        <section className={`${cardClass} p-6 space-y-4`} aria-labelledby="payment-methods-heading">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <h2 id="payment-methods-heading" className="text-lg font-semibold text-gray-800 dark:text-white/90">Payment Methods</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsAddCardOpen(true)}
              className="flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600 font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Payment Method
            </button>
          </div>

          {methodsLoading ? (
            <div className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" aria-busy="true" />
          ) : paymentMethods.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No payment method on file.</p>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-gray-50 dark:bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CreditCard className="h-5 w-5 text-brand-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90 capitalize">
                      {method.cardBrand ?? method.type} ending in {method.lastFour ?? "••••"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {method.expiryMonth && method.expiryYear
                        ? `Expires ${String(method.expiryMonth).padStart(2, "0")}/${String(method.expiryYear).slice(-2)}`
                        : "No expiry"}
                      {method.isDefault ? " • Default" : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeMethod.mutate(method.id)}
                  disabled={removeMethod.isPending}
                  aria-label={`Remove ${method.cardBrand ?? "card"} ending in ${method.lastFour ?? ""}`}
                  className="text-gray-400 hover:text-error-600 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </section>

        {/* Invoices */}
        <section className={`${cardClass} overflow-hidden`} aria-labelledby="invoices-heading">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <h2 id="invoices-heading" className="text-lg font-semibold text-gray-800 dark:text-white/90">Invoice History</h2>
          </div>
          {invoicesLoading ? (
            <div className="p-6"><div className="h-10 animate-pulse rounded bg-gray-100 dark:bg-gray-800" aria-busy="true" /></div>
          ) : invoices.length === 0 ? (
            <p className="p-6 text-sm text-gray-500 dark:text-gray-400">No invoices yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Invoice</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                  {invoices.map((invoice) => {
                    const link = invoice.invoicePdfUrl ?? invoice.hostedInvoiceUrl;
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                        <td className="px-6 py-4 font-mono font-medium text-gray-800 dark:text-white/90">{invoice.invoiceNumber}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{formatDate(invoice.createdAt)}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90">{formatCurrency(invoice.amount, invoice.currency)}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 capitalize">
                            {invoice.status?.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {link ? (
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-600 text-xs font-medium inline-flex items-center gap-1">
                              <Download className="h-3.5 w-3.5" />
                              {invoice.invoicePdfUrl ? "PDF" : "View"}
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <AddCardModal isOpen={isAddCardOpen} onClose={() => setIsAddCardOpen(false)} />
      <UpgradePlanModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} subscription={subscription} />
    </>
  );
}
