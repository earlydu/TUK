import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Center — WEEE Compliance",
  description:
    "TUK Ltd legal center — WEEE compliance information, recycling procedures, and environmental responsibility. Registered with the Environment Agency for B2B WEEE obligations.",
  openGraph: {
    title: "Legal Center — TUK Ltd WEEE Compliance",
    description:
      "Learn about TUK Ltd's WEEE compliance, environmental commitments, and product recycling procedures.",
  },
  alternates: {
    canonical: "/legal-center",
  },
};

export default function LegalCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
