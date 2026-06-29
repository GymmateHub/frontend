import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { ChevronLeftIcon } from "../../icons";
import { requestPasswordReset } from "../../auth/auth.store";

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setError(null);
      setIsLoading(true);
      await requestPasswordReset(data.email);
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send reset email";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Forgot Password | GymMate" description="Reset your GymMate password" />
      <AuthLayout>
        <div className="flex flex-col flex-1">
          <div className="w-full max-w-md pt-10 mx-auto">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeftIcon className="size-5" />
              Back to sign in
            </Link>
          </div>
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Forgot Password
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-lg bg-success-50 px-4 py-4 text-sm text-success-700 dark:bg-success-500/10 dark:text-success-400">
                Check your email for a password reset link.
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Email <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", { required: true })}
                      />
                    </div>
                    <Button className="w-full" size="sm" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
