import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useAuth } from "../../auth/auth.store";
import type { LoginRequest } from "../../auth/auth.types";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const location = useLocation();
  // Where ProtectedRoute sent us from, if the user tried a deep link.
  // No fallback here — the auth store picks the role's home screen.
  const from = (location.state as { from?: { pathname?: string } })?.from
    ?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();

  // Auto-dismiss the inline error banner after 5 seconds:
  // fade it out first, then unmount once the transition has finished.
  const [errorVisible, setErrorVisible] = useState(false);
  useEffect(() => {
    if (!error) return;
    setErrorVisible(true);
    const hideTimer = setTimeout(() => setErrorVisible(false), 5000);
    const clearTimer = setTimeout(() => setError(null), 5500);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  }, [error]);

  const onSubmit = async (data: LoginRequest) => {
    try {
      setError(null);
      await login(data, from);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Invalid email or password";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back to GymMateHub
            </p>
          </div>

          {error && (
            <div
              className={`mb-4 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 transition-all duration-500 ease-out dark:bg-error-500/10 dark:text-error-400 ${
                errorVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
              }`}
            >
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
                  placeholder="info@gmail.com"
                  error={!!errors.email}
                  hint={errors.email ? "Email is required" : undefined}
                  {...register("email", { required: true })}
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    error={!!errors.password}
                    hint={errors.password ? "Password is required" : undefined}
                    {...register("password", { required: true })}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div>
                <Button
                  className="w-full"
                  size="sm"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : undefined
                  }
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
