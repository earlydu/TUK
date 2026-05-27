import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & FAQ",
  description:
    "Find answers to common questions about TUK Ltd connectivity solutions, ordering process, technical support, delivery times, and returns policy.",
  openGraph: {
    title: "Help & FAQ — TUK Ltd",
    description:
      "Get answers about TUK products, ordering, technical support, delivery and returns. Our team is ready to help.",
  },
  alternates: {
    canonical: "https://tuk.co.uk/faq",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
