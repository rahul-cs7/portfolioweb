import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "RahulVerse | Rahul Kumar", template: "%s | RahulVerse" },
  description: "Rahul Kumar is a full-stack developer, researcher, and Computer Science undergraduate building useful digital products.",
  keywords: ["Rahul Kumar", "full stack developer", "MERN", "Java", "AI research", "portfolio"],
  openGraph: { title: "RahulVerse", description: "Engineering ideas into useful digital products.", type: "website" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#070a12" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rahul Kumar",
    email: "mailto:rahuluu2327@gmail.com",
    address: { "@type": "PostalAddress", addressLocality: "Dehradun", addressCountry: "IN" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Uttaranchal University" },
    knowsAbout: ["Full-stack development", "Java", "JavaScript", "MongoDB", "Data analytics", "Artificial intelligence"],
  };
  return (
    <html lang="en">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
