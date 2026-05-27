import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Request a personalised quote for TUK Ltd voice and data cabling products. Get competitive B2B pricing for bulk orders, bespoke solutions, and worldwide delivery.",
  openGraph: {
    title: "Request a Quote — TUK Ltd",
    description:
      "Get a fast, personalised quote for TUK Ltd cabling solutions. Competitive B2B pricing for your specific requirements.",
  },
  alternates: {
    canonical: "/request-quote",
  },
};

export default function RequestQuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
