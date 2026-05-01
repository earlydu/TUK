"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { IconHeart, IconTrash } from "@tabler/icons-react";
import { getWishlist, removeFromWishlist } from "@/src/lib/wishlist";
import EnquiryModal from "@/components/common/EnquiryModal";
import Counter from "@/components/common/homepage/counter";

type WishlistItem = {
  id: string;
  slug?: string;
  name?: string;
  title?: string;
  bannerImageUrl?: string;
  img?: string;
  stock?: string;
};

const Page = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => getWishlist());

  // Fetch slugs from API for any wishlist items missing slug
  useEffect(() => {
    const enrichWishlistSlugs = async () => {
      const currentWishlist: WishlistItem[] = getWishlist();
      const needsSlugs = currentWishlist.some((item) => !item.slug);
      if (!needsSlugs || currentWishlist.length === 0) return;

      try {
        const res = await fetch("/api/products");
        const products: { id: string; slug: string }[] = await res.json();

        const slugMap = new Map(products.map((p) => [p.id, p.slug]));

        const patched = currentWishlist.map((item) => ({
          ...item,
          slug: item.slug || slugMap.get(item.id) || undefined,
        }));

        localStorage.setItem("wishlist", JSON.stringify(patched));
        setWishlist(patched);
      } catch (err) {
        console.error("Failed to enrich wishlist slugs:", err);
      }
    };

    enrichWishlistSlugs();
  }, []);

  const handleDelete = (id: string) => {
    const updated = removeFromWishlist(id);
    setWishlist(updated);
  };

  const wishlistProductNames = wishlist.map(
    (item) => item.name || item.title || "Product",
  );

  return (
    <>
      <Header />
      <div
        className="h-72 w-full   text-white flex flex-col items-center justify-center font-poppins px-4
          text-center "
        style={{
          background: "linear-gradient(to right, #141D3D, #364FA3)",
        }}
      >
        <h1 className="text-3xl md:text-4xl xl:text-5xl font-semibold font-poppins">
          My Wishlist
        </h1>
        <p className="mt-4 text-sm md:text-base text-white/80 max-w-2xl mx-auto font-poppins">
          Manage your favorite products
        </p>
      </div>

      <section className="w-full bg-gray-100 py-12 font-poppins">
        <div className="max-w-5xl mx-auto px-4">
          {/* Title */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center gap-3">
              <IconHeart className="text-[#0300A7]" />
              <h1 className="text-xl font-semibold text-gray-800">
                My Wishlist
              </h1>
            </div>
            {wishlist.length > 0 ? (
              <EnquiryModal
                products={wishlistProductNames}
                buttonLabel="Send wishlist enquiry"
                dialogTitle="Send Wishlist Enquiry"
                buttonClassName="rounded-full cursor-pointer bg-[#0300A7] hover:bg-[#1E3A8A] text-xs px-6 h-10"
              />
            ) : null}
          </div>

          <Card className="bg-white border rounded-xl">
            <CardContent className="p-0">
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <IconHeart size={48} className="text-gray-300 mb-4" />
                  <h2 className="text-lg font-semibold text-gray-600 mb-2">
                    Your wishlist is empty
                  </h2>
                  <p className="text-sm text-gray-400 max-w-md">
                    Browse our products and click the heart icon to add items to
                    your wishlist.
                  </p>
                  <Link
                    href="/product"
                    className="mt-6 inline-flex items-center gap-2 bg-[#0300A7] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#1E3A8A] transition"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-12 border-b text-sm font-semibold text-gray-500 uppercase px-6 py-4">
                    <div className="col-span-2">Product</div>
                    <div className="col-span-8">Details</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  {/* Rows */}
                  {wishlist.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center border-b last:border-none px-4 md:px-6 py-6 gap-4"
                    >
                      {/* Product Image */}
                      <Link
                        href={item.slug ? `/product/${item.slug}` : "/product"}
                        className="md:col-span-10 flex flex-col md:flex-row items-start md:items-center gap-4 no-underline"
                      >
                        <div className="md:col-span-2 flex items-center">
                          <div className="flex items-center">
                            <Image
                              src={item.bannerImageUrl || item.img || ""}
                              alt={item.name || item.title || "product"}
                              width={80}
                              height={80}
                              className="object-contain rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-8">
                          <h3 className="font-semibold text-gray-800 hover:text-[#0300A7]">
                            {item.name || item.title}
                          </h3>

                          <p
                            className={`text-sm ${
                              item.stock === "In Stock"
                                ? "text-[#0300A7]"
                                : "text-[#F59E0B]"
                            }`}
                          >
                            {item.stock}
                          </p>
                        </div>
                      </Link>

                      {/* Actions */}
                      <div className="md:col-span-2 flex items-center md:justify-end gap-4">
                        <IconTrash
                          className="text-gray-400 cursor-pointer hover:text-red-500"
                          onClick={() => handleDelete(item.id)}
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Counter />
      <Footer />
    </>
  );
};

export default Page;
