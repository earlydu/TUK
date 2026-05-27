import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the full range of TUK Ltd voice and data cabling products including patch leads, RJ45 connectors, Cat5e, Cat6 and Cat6a solutions. Filter by category and find the right product for your needs.",
  openGraph: {
    title: "Products — TUK Ltd Voice & Data Cabling Range",
    description:
      "Explore our comprehensive range of high-quality voice and data copper cabling products for B2B customers worldwide.",
  },
  alternates: {
    canonical: "https://tuk.co.uk/category",
  },
};

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
