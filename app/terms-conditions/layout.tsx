import { Metadata } from "next";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Topbar from "@/components/common/topbar";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "TUK Ltd terms and conditions of sale and use. Read our terms governing the purchase and use of our voice and data cabling products and services.",
  alternates: {
    canonical: "/terms-conditions",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Topbar /> */}
      <Header />
      {children}
      <Footer />
    </>
  );
}
