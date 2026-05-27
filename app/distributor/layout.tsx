import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authorised Distributors",
  description:
    "Find TUK Ltd authorised distributors worldwide. Our trusted network of specialised partners ensures global availability of our voice and data cabling products.",
  openGraph: {
    title: "TUK Ltd Authorised Distributors — Global Network",
    description:
      "TUK Ltd products are available worldwide through our trusted network of specialised partners. Find a distributor in your region.",
  },
  alternates: {
    canonical: "https://tuk.co.uk/distributor",
  },
};

export default function DistributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
