import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Products",
  description:
    "Search the full range of TUK Ltd voice and data cabling products. Find patch leads, RJ45 connectors, Cat5e, Cat6, Cat6a solutions and more.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/search",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
