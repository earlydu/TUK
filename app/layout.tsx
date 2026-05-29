import { Metadata } from "next";
import "./globals.css";
import { Inter, Poppins, Barlow } from "next/font/google";
import { Toaster } from "sonner";
import Topbar from "@/components/common/topbar";
import GlobalLoader from "@/components/common/GlobalLoader";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "https://tuk.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TUK Ltd — Voice & Data Cabling Solutions | Since 1984",
    template: "%s | TUK Ltd",
  },
  description:
    "TUK Ltd is a leading UK manufacturer of voice and data copper cabling solutions. Supplying manufacturers, wholesalers and distributors across 10+ countries since 1984. ISO 9001:2015 certified.",
  keywords: [
    "TUK Ltd",
    "voice cabling",
    "data cabling",
    "copper cabling",
    "RJ45",
    "patch leads",
    "Cat5e",
    "Cat6",
    "Cat6a",
    "network cabling",
    "structured cabling",
    "B2B cabling supplier",
    "UK cable manufacturer",
    "connectivity solutions",
  ],
  authors: [{ name: "TUK Ltd" }],
  creator: "TUK Ltd",
  publisher: "TUK Ltd",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "TUK Ltd",
    title: "TUK Ltd — Voice & Data Cabling Solutions | Since 1984",
    description:
      "Leading UK manufacturer of voice and data copper cabling solutions. ISO 9001:2015 certified. Supplying manufacturers, wholesalers and distributors worldwide.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TUK Ltd — Voice & Data Cabling Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TUK Ltd — Voice & Data Cabling Solutions",
    description:
      "Leading UK manufacturer of voice and data copper cabling solutions since 1984.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "uV9nyRbkqT34PZaTJRW6UbiOx-7VlDH0NwyxRH-l7_o",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://di.oemsecrets.com/js/distributor-inventory_0.3.0.min.js"></script>
        <link
          href="https://di.oemsecrets.com/css/distributor-inventory_0.0.4.min.css"
          rel="stylesheet"
        ></link>
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${barlow.variable}`}
      >
        {/* Google Analytics 4 — G-1MK5QGNKMF */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1MK5QGNKMF"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1MK5QGNKMF', {
              send_page_view: true
            });
          `}
        </Script>

        {/* <Topbar /> */}
        {children}
        <Toaster position="top-right" richColors />
        <GlobalLoader />
      </body>
    </html>
  );
}
