import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import { authStorage, useAuth } from "../../auth/auth.store";
import { homeFor } from "../../auth/permissions";
import { getErrorMessage } from "../../api/axios";
import { teamAPI, type ValidatedInvite } from "../../features/team/team.api";

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

const roleLabel = (role: string) =>
  ({ MANAGER: "Manager", STAFF: "Staff", TRAINER: "Trainer" } as Record<string, string>)[role] ?? role;

/**
 * Landing page of the team invite email (/invite?token=...). The invitee sets a password,
 * the backend creates their account in the inviting organisation and logs them in.
 */
export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { refreshUserData } = useAuth();

  const [invite, setInvite] = useState<ValidatedInvite | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoadError("This invite link is incomplete. Ask your gym owner to resend it.");
      return;
    }
    teamAPI
      .validateInvite(token)
      .then((res) => {
        setInvite(res.data);
        setFirstName(res.data.firstName ?? "");
        setLastName(res.data.lastName ?? "");
      })
      .catch((e) => setLoadError(getErrorMessage(e)));
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 12) {
      setError("Password must be at least 12 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setError(null);
      setSubmitting(true);
      const res = await teamAPI.acceptInvite({
        inviteToken: token,
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      const login = res.data;
      authStorage.setToken(login.accessToken!);
      authStorage.setRefreshToken(login.refreshToken!);
      const user = {
        userId: login.userId,
        email: login.email,
        firstName: login.firstName,
        lastName: login.lastName,
        role: login.role,
        organisationId: login.organisationId ?? "",
        gymId: login.gymId ?? "",
        permissions: login.permissions,
      };
      authStorage.setUser(user);
      refreshUserData();
      window.location.assign(homeFor(user));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Join Your Team | GymMate" description="Accept your GymMate team invite" />
      <AuthLayout>
        <div className="flex flex-col flex-1">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Join your team
            </h1>

            {loadError && (
              <div className="mb-4 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
                {loadError} <Link to="/login" className="underline">Go to sign in</Link>
              </div>
            )}

            {invite?.expired && (
              <div className="mb-4 rounded-lg bg-warning-50 px-4 py-3 text-sm text-warning-700">
                This invite has expired. Ask your gym owner to resend it.
              </div>
            )}

            {invite && !invite.expired && (
              <>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                  {invite.invitedBy ? `${invite.invitedBy} invited you` : "You've been invited"} to join
                  {invite.gymName ? ` ${invite.gymName}` : " a gym"} as <strong>{roleLabel(invite.role)}</strong>.
                  Your login email is <strong>{invite.email}</strong>.
                </p>

                {error && (
                  <div className="mb-4 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
                    {error}
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">First Name</label>
                      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Last Name</label>
                      <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 000 0000" className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Password *</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 12 characters"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Confirm Password *</label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat your password"
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
                  >
                    {submitting ? "Joining..." : "Join Team"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
