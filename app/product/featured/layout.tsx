import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Featured Products",
  description:
    "Explore TUK Ltd's hand-picked featured products — our most popular and recommended voice and data cabling solutions for professionals.",
  openGraph: {
    title: "Featured Products — TUK Ltd",
    description:
      "Discover our most popular voice and data cabling products, curated for professionals.",
  },
  alternates: {
    canonical: "/product/featured",
  },
};

export default function FeaturedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
