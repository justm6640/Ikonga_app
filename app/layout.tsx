import type { Metadata } from "next";
import { DM_Serif_Display, Poppins, Dancing_Script } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",  // Prevent FOIT
});

const poppins = Poppins({
  weight: ["400", "500", "600"],  // Charter: normal, medium, semibold
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",  // Prevent FOIT
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",  // Prevent FOIT
});

export const metadata: Metadata = {
  title: "IKONGA - Coaching Bien-être",
  description: "Application PWA de coaching bien-être",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${dmSerif.variable} ${poppins.variable} ${dancingScript.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
