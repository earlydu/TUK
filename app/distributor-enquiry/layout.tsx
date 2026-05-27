import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Distributor Enquiry",
  description:
    "Interested in becoming a TUK Ltd authorised distributor? Submit your enquiry to join our global network of trusted cabling product partners.",
  openGraph: {
    title: "Become a TUK Ltd Distributor",
    description:
      "Join TUK Ltd's trusted global distribution network. Submit your enquiry to become an authorised partner.",
  },
  alternates: {
    canonical: "https://tuk.co.uk/distributor-enquiry",
  },
};

export default function DistributorEnquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
