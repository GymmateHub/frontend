import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { verifyOtp, resendOtp } from "../../auth/auth.store";

interface VerifyEmailForm {
  otp: string;
}

interface LocationState {
  userId?: string;
  email?: string;
}

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as LocationState) ?? {};
  const { userId = "", email = "" } = state;

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const { register, handleSubmit } = useForm<VerifyEmailForm>();

  const onSubmit = async (data: VerifyEmailForm) => {
    try {
      setError(null);
      setIsLoading(true);
      await verifyOtp(userId, data.otp);
      navigate("/login", { state: { verified: true } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "OTP verification failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setError(null);
      await resendOtp(userId);
      setResent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend OTP";
      setError(msg);
    }
  };

  return (
    <>
      <PageMeta title="Verify Email | GymMate" description="Verify your email address" />
      <AuthLayout>
        <div className="flex flex-col flex-1">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Verify Your Email
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We sent a verification code to{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {email || "your email"}
                </span>
                . Enter it below.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
                {error}
              </div>
            )}

            {resent && (
              <div className="mb-4 rounded-lg bg-success-50 px-4 py-3 text-sm text-success-700 dark:bg-success-500/10 dark:text-success-400">
                A new code has been sent to your email.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Verification Code <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your OTP code"
                    {...register("otp", { required: true })}
                  />
                </div>
                <Button className="w-full" size="sm" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Email"}
                </Button>
              </div>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn&apos;t receive a code?{" "}
                <button
                  onClick={handleResend}
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
