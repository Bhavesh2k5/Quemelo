import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "QUEMELO — That Song. Right Now. Yours.",
  description: "Identify any song, anywhere. The acoustic portal. 50M+ songs. 0.3s average recognition.",
  keywords: ["song identifier", "music recognition", "quemelo"],
  openGraph: {
    title: "QUEMELO — That Song. Right Now. Yours.",
    description: "The ultimate music recognition experience. Built for the 2am moment.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Bangers&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <CustomCursor />
        <NavBar />
        <div style={{ paddingTop: 80 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
