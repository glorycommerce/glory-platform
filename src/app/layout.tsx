import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { defaultSeo } from "@/lib/seo";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultSeo.url),
  title: {
    default: defaultSeo.title,
    template: `%s | ${defaultSeo.title}`,
  },
  description: defaultSeo.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: defaultSeo.title,
    description: defaultSeo.description,
    url: defaultSeo.url,
    siteName: defaultSeo.title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeo.title,
    description: defaultSeo.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
