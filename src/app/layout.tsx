import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { AuthProvider } from "@/app/components/AuthProvider";
import AuthGate from "@/app/components/AuthGate";
import AppHeader from "@/app/components/AppHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nova – Vente",
  description: "Caisse numérique pour les petits commerçants au Maroc.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <AuthProvider>
            <AppHeader />
            <AuthGate>{children}</AuthGate>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
