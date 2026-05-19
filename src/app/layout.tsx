import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "NexusYield — DeFi Yield Intelligence",
  description: "Advanced DeFi yield analytics, risk modeling, and portfolio optimization platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased bg-mesh">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
