import { Metadata } from "next";
import "./globals.css";
import { Inter, Poppins, Barlow } from "next/font/google";
import { Toaster } from "sonner";
import Topbar from "@/components/common/topbar";

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

export const metadata: Metadata = {
  title: "Home Page - TUK Ltd",
  description: "",
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
        <Topbar />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
