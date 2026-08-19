import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { registerGymOwner } from "../../auth/auth.store";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  organisationName?: string;
  gymName?: string;
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    if (!isChecked) {
      setError("Please accept the Terms and Conditions to continue.");
      return;
    }
    try {
      setError(null);
      setIsLoading(true);
      const result = await registerGymOwner(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.phone,
        data.organisationName,
        data.gymName
      );
      navigate("/verify-email", {
        state: {
          userId: result.userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to home
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create your GymMate account
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>
                    First Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your first name"
                    {...register("firstName", { required: "First name is required" })}
                  />
                  {errors.firstName && (
                    <span className="mt-1 block text-xs text-error-500">
                      {errors.firstName.message}
                    </span>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <Label>
                    Last Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your last name"
                    {...register("lastName", { required: "Last name is required" })}
                  />
                  {errors.lastName && (
                    <span className="mt-1 block text-xs text-error-500">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <span className="mt-1 block text-xs text-error-500">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="e.g. +1234567890"
                  {...register("phone")}
                />
                {errors.phone && (
                  <span className="mt-1 block text-xs text-error-500">
                    {errors.phone.message}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>Organisation Name</Label>
                  <Input
                    type="text"
                    placeholder="e.g. Iron Peak Holdings"
                    {...register("organisationName")}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Label>Gym Name</Label>
                  <Input
                    type="text"
                    placeholder="e.g. Iron Peak Fitness"
                    {...register("gymName")}
                  />
                </div>
              </div>
              <div>
                <Label>
                  Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 12,
                        message: "Password must be at least 12 characters long",
                      },
                    })}
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
                {errors.password && (
                  <span className="mt-1 block text-xs text-error-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  By creating an account means you agree to the{" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Terms and Conditions,
                  </span>{" "}
                  and our{" "}
                  <span className="text-gray-800 dark:text-white">
                    Privacy Policy
                  </span>
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-60"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
