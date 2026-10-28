import AuthPortal from "../../components/auth-portal/auth-portal";

export const metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <AuthPortal mode="signup" />;
}
