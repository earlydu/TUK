import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about TUK Ltd — a leading UK manufacturer of voice and data copper cabling solutions since 1984. ISO 9001:2015 certified, based in South West London with manufacturing in the UK and Far East.",
  openGraph: {
    title: "About TUK Ltd — Our Heritage & Mission",
    description:
      "Nearly four decades at the forefront of the cabling industry. Discover our ISO 9001:2015 certified operations, core values, and WEEE compliance commitment.",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
