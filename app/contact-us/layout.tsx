import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with TUK Ltd for voice and data cabling solutions, technical support, or bespoke requirements. Based in Wimbledon, London. Call +44 (0) 20 8946 6688 or email sales@tuk.co.uk.",
  openGraph: {
    title: "Contact TUK Ltd — Get Expert Cabling Support",
    description:
      "Reach our expert team for product enquiries, technical support, or bespoke cabling requirements. Visit us in Wimbledon, London.",
  },
  alternates: {
    canonical: "https://tuk.co.uk/contact-us",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
