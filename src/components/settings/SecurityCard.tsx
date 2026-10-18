import { useState } from "react";
import { Loader2, Shield, X } from "lucide-react";
import { authAPI } from "../../auth/auth.store";
import { getErrorMessage } from "../../api/axios";
import { Modal } from "../ui/modal";
import { useToast } from "../../hooks/use-toast";
import { cardClass, inputClass, primaryButtonClass, secondaryButtonClass } from "./styles";

/** Matches the backend password policy (registerOwner / PasswordPolicyService). */
export const MIN_PASSWORD_LENGTH = 12;

export function validatePasswordChange(form: { current: string; newPass: string; confirm: string }): string | null {
  if (!form.current) return "Enter your current password.";
  if (form.newPass.length < MIN_PASSWORD_LENGTH) return `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (form.newPass !== form.confirm) return "New passwords do not match.";
  if (form.newPass === form.current) return "New password must be different from your current password.";
  return null;
}

const emptyForm = { current: "", newPass: "", confirm: "" };

export default function SecurityCard() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setIsOpen(false);
    setForm(emptyForm);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validatePasswordChange(form);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await authAPI.changePassword(form.current, form.newPass);
      toast({ title: "Password changed", description: "Use your new password next time you sign in." });
      close();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className={cardClass} aria-labelledby="security-heading">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-error-100 dark:bg-error-500/20">
            <Shield className="h-5 w-5 text-error-600 dark:text-error-400" />
          </div>
          <h2 id="security-heading" className="text-base font-semibold text-gray-800 dark:text-white/90">Security</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">Password</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Change the password you use to sign in</p>
            </div>
            <button type="button" onClick={() => setIsOpen(true)} className={secondaryButtonClass}>
              Change Password
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Two-factor authentication
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">Coming soon</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Add an extra layer of security to your logins</p>
            </div>
            <button type="button" disabled className={secondaryButtonClass}>
              Enable 2FA
            </button>
          </div>
        </div>
      </section>

      <Modal isOpen={isOpen} onClose={close} className="max-w-[450px] p-6">
        <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
          <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">Change Password</h5>
              <p className="text-xs text-gray-400 mt-0.5">Use at least {MIN_PASSWORD_LENGTH} characters</p>
            </div>
            <button type="button" onClick={close} aria-label="Close" className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3.5 py-4">
            <div>
              <label htmlFor="current-password" className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-400">Current Password</label>
              <input id="current-password" type="password" autoComplete="current-password" value={form.current}
                onChange={(e) => setForm({ ...form, current: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="new-password" className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-400">New Password</label>
              <input id="new-password" type="password" autoComplete="new-password" value={form.newPass}
                onChange={(e) => setForm({ ...form, newPass: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-400">Confirm New Password</label>
              <input id="confirm-password" type="password" autoComplete="new-password" value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={inputClass} />
            </div>
            {error && <p role="alert" className="text-sm text-error-600 dark:text-error-400">{error}</p>}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 justify-end">
            <button type="button" onClick={close} className={secondaryButtonClass}>Cancel</button>
            <button type="submit" disabled={submitting} className={primaryButtonClass}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
