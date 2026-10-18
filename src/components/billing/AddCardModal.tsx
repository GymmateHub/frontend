import { useState } from "react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { Loader2, X } from "lucide-react";
import { Modal } from "../ui/modal";
import { stripePromise } from "../../features/billing/stripe";
import { useAttachPaymentMethod } from "../../features/billing/billing.hooks";

const cancelClass =
  "px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300";

function CardForm({ onClose }: { onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const attach = useAttachPaymentMethod();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const card = elements?.getElement(CardElement);
    if (!stripe || !card) return;

    setError(null);
    setBusy(true);
    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({ type: "card", card });
      if (stripeError || !paymentMethod) {
        setError(stripeError?.message ?? "We couldn't read that card. Please check the details.");
        return;
      }
      await attach.mutateAsync(paymentMethod.id);
      onClose();
    } catch {
      // the mutation's onError already toasted the API message
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="py-4 space-y-3">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-400">Card details</label>
        <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white px-4 py-3">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        <p className="text-xs text-gray-400">Card details are entered directly with Stripe and never stored on our servers.</p>
        {error && <p role="alert" className="text-sm text-error-600 dark:text-error-400">{error}</p>}
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 justify-end">
        <button type="button" onClick={onClose} className={cancelClass}>Cancel</button>
        <button
          type="submit"
          disabled={!stripe || busy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Card
        </button>
      </div>
    </form>
  );
}

export default function AddCardModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] p-6">
      <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">Add Card</h5>
          <p className="text-xs text-gray-400 mt-0.5">Add a credit or debit card for your subscription</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      {stripePromise ? (
        <Elements stripe={stripePromise}>
          <CardForm onClose={onClose} />
        </Elements>
      ) : (
        <div className="py-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Card payments aren't set up for this environment yet, so a card can't be added right now.
          </p>
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className={cancelClass}>Close</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
