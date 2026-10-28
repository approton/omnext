import AuthPortal from "../../components/auth-portal/auth-portal";

export const metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <AuthPortal mode="login" />;
}
