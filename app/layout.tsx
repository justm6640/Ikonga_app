import type { Metadata } from "next";
import { DM_Serif_Display, Poppins, Dancing_Script } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-hand",
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
      </body>
    </html>
  );
}
