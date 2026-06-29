import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In | GymMate"
        description="Sign in to your GymMate account"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
