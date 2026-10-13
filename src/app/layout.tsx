import type { Metadata } from "next";
import { Epilogue, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "TunedIn - Sound Sanctuary",
  description: "High-fidelity music streaming service crafted for audiophiles and creators.",
  icons: {
    icon: [
      { url: "/music-logo-static.svg", type: "image/svg+xml" },
    ],
    shortcut: "/music-logo-static.svg",
    apple: "/music-logo-static.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${epilogue.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
