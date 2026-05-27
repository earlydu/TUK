import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse all TUK Ltd products — voice and data cabling solutions including patch leads, RJ45 connectors, face plates, modules and more. Filter by category, sort by latest or name.",
  openGraph: {
    title: "All Products — TUK Ltd Cabling Solutions",
    description:
      "Browse our complete range of voice and data cabling products with easy filtering and sorting options.",
  },
  alternates: {
    canonical: "/product",
  },
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
