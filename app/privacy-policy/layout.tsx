import { Metadata } from "next";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Topbar from "@/components/common/topbar";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "TUK Ltd privacy policy — learn how we collect, use, and protect your personal data. Covers all activities including cabling systems and connectivity products.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
