import { useRef, useState } from "react";
import { Building2, Loader2, Save, Upload } from "lucide-react";
import type { GymResponse } from "../../features/gyms/gyms.api";
import { useUpdateGym } from "../../features/gyms/gyms.hooks";
import { useToast } from "../../hooks/use-toast";
import { cardClass, inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "./styles";

export const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export const CURRENCY_OPTIONS = [
  { code: "NGN", label: "Nigerian Naira (₦)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GHS", label: "Ghanaian Cedi (GH₵)" },
  { code: "KES", label: "Kenyan Shilling (KSh)" },
  { code: "ZAR", label: "South African Rand (R)" },
  { code: "CAD", label: "Canadian Dollar (CA$)" },
  { code: "AUD", label: "Australian Dollar (AU$)" },
];

/** Render as `<GymProfileCard key={gym.id} gym={gym} />` so state re-seeds when the gym changes. */
export default function GymProfileCard({ gym }: { gym: GymResponse }) {
  const updateGym = useUpdateGym();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(gym.name ?? "");
  const [street, setStreet] = useState(gym.address?.street ?? "");
  const [phone, setPhone] = useState(gym.contactPhone ?? "");
  const [currency, setCurrency] = useState(gym.currency ?? "NGN");
  const [logoUrl, setLogoUrl] = useState(gym.logoUrl ?? "");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  const canSave = !!trimmedName && !!trimmedPhone && !updateGym.isPending;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Unsupported file", description: "Please choose an image file.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast({ title: "Image too large", description: "Logo must be 2 MB or smaller.", variant: "destructive" });
      return;
    }
    setLogoPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
  };

  const handleSave = async () => {
    if (!canSave) return;
    try {
      await updateGym.mutateAsync({
        id: gym.id,
        data: {
          name: trimmedName,
          contactPhone: trimmedPhone,
          // Required by the API and not editable here — send the stored value back.
          contactEmail: gym.contactEmail ?? "",
          description: gym.description ?? undefined,
          website: gym.website ?? undefined,
          // The API overwrites the whole address, so echo the fields we don't edit.
          street: street.trim(),
          city: gym.address?.city ?? undefined,
          state: gym.address?.state ?? undefined,
          postalCode: gym.address?.postalCode ?? undefined,
          country: gym.address?.country ?? undefined,
          currency,
          logoUrl: logoUrl.trim() || undefined,
        },
      });
    } catch {
      // error toast is shown by the hook
    }
  };

  const shownLogo = logoPreview ?? (logoUrl.trim() || null);

  return (
    <section className={cardClass} aria-labelledby="gym-profile-heading">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/20">
          <Building2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        </div>
        <h2 id="gym-profile-heading" className="text-base font-semibold text-gray-800 dark:text-white/90">
          Gym Profile
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="gym-name" className={labelClass}>Gym Name</label>
          <input id="gym-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="My Awesome Gym" />
        </div>
        <div>
          <label htmlFor="gym-address" className={labelClass}>Address</label>
          <input id="gym-address" type="text" value={street} onChange={(e) => setStreet(e.target.value)} className={inputClass} placeholder="123 Main Street" />
        </div>
        <div>
          <label htmlFor="gym-phone" className={labelClass}>Phone Number</label>
          <input id="gym-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+234 800 000 0000" />
        </div>
        <div>
          <label htmlFor="gym-currency" className={labelClass}>Currency</label>
          <select id="gym-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
            {!CURRENCY_OPTIONS.some((c) => c.code === currency) && <option value={currency}>{currency}</option>}
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gym-logo-url" className={labelClass}>Logo</label>
          <div className="flex items-center gap-4">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" data-testid="logo-file-input" />
            <div className="h-16 w-16 shrink-0 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800">
              {shownLogo ? (
                <img src={shownLogo} alt="Gym logo" className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-6 w-6 text-gray-300 dark:text-gray-600" />
              )}
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} className={`${secondaryButtonClass} flex items-center gap-2`}>
              <Upload className="h-4 w-4" />
              Upload Logo
            </button>
          </div>
          <input
            id="gym-logo-url"
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className={`${inputClass} mt-3`}
            placeholder="https://example.com/logo.png"
          />
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {logoPreview
              ? "Preview only: image hosting isn't available yet. Paste a link to your hosted logo above and save."
              : "Choose an image to preview it, or paste a link to your hosted logo."}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={handleSave} disabled={!canSave} className={primaryButtonClass}>
          {updateGym.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Profile
        </button>
      </div>
    </section>
  );
}
