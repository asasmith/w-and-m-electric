import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import EmergencyBanner from "@/components/EmergencyBanner";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import PreviewBanner from "@/components/PreviewBanner";
import { fallbackSiteSettings } from "@/lib/placeholders";
import { isPreviewEnabled } from "@/lib/sanity/preview";
import { getSiteSettings } from "@/lib/sanity/queries";
import "./globals.css";

const sans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "W&M Electrical",
    template: "%s | W&M Electrical",
  },
  description: "Licensed residential and commercial electrical services with sharp response, clean workmanship, and dependable scheduling.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isPreview = await isPreviewEnabled();
  let siteSettings = fallbackSiteSettings;

  try {
    siteSettings = (await getSiteSettings({ preview: isPreview })) ?? fallbackSiteSettings;
  } catch {
    siteSettings = fallbackSiteSettings;
  }

  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} font-sans antialiased`}>
        <PreviewBanner isPreview={isPreview} />
        <EmergencyBanner enabled={Boolean(siteSettings.emergencyAvailable)} phone={siteSettings.phone} />
        <Navigation companyName={siteSettings.companyName} phone={siteSettings.phone} />
        <main>{children}</main>
        <Footer siteSettings={siteSettings} />
      </body>
    </html>
  );
}
