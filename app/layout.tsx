import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "FidelAI – Amharic AI Data Marketplace",
  description:
    "AI-powered crowdsourcing platform for Amharic dataset collection, annotation, quality control, and selling.",
  keywords: [
    "Amharic",
    "AI",
    "dataset",
    "marketplace",
    "annotation",
    "NLP",
    "crowdsourcing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
