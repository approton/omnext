import "./globals.css";
import Script from "next/script";
import SiteHeader from "../components/site-header/site-header";
import SiteFooter from "../components/site-footer/site-footer";
import InteractiveSurface from "../components/interactive-surface/interactive-surface";
import ScrollProgress from "../components/scroll-progress/scroll-progress";
import { ThemeProvider } from "../components/theme-provider/theme-provider";
import { AuthProvider } from "../components/auth-provider/auth-provider";

export const metadata = {
  title: {
    default: "Omnext Technologies | Website, Software & Web App Development",
    template: "%s | Omnext Technologies",
  },
  description:
    "Omnext Technologies designs and develops websites, custom software and web applications, alongside cloud and digital product engineering.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Omnext Technologies | Website, Software & Web App Development",
    description:
      "Website development, custom software and web applications designed to help businesses move forward.",
    siteName: "Omnext Technologies",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script
          id="omnext-theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => {
            const preference = window.matchMedia("(prefers-color-scheme: dark)");
            let theme = "system";
            try {
              const saved = window.localStorage.getItem("omnext-theme");
              if (["light", "dark", "system"].includes(saved)) theme = saved;
            } catch {}
            const resolved = theme === "system" ? (preference.matches ? "dark" : "light") : theme;
            document.documentElement.dataset.theme = resolved;
            document.documentElement.style.colorScheme = resolved;
          })();`,
          }}
        />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <ThemeProvider>
          <AuthProvider>
            <SiteHeader />
            <InteractiveSurface />
            <ScrollProgress />
            {children}
            <SiteFooter />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
