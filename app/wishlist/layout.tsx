import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
  description:
    "View and manage your saved TUK Ltd products. Keep track of your preferred voice and data cabling items for easy access and quoting.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://tuk.co.uk/wishlist",
  },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
