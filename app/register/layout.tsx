import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a TUK Ltd account to access B2B pricing, manage orders, and track shipments.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
