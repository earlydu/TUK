import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals",
  description:
    "Browse the latest additions to TUK Ltd's product range — new voice and data cabling solutions, connectors, and accessories.",
  openGraph: {
    title: "New Arrivals — TUK Ltd",
    description:
      "Check out the newest additions to our voice and data cabling product range.",
  },
  alternates: {
    canonical: "/product/new-arrivals",
  },
};

export default function NewArrivalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
