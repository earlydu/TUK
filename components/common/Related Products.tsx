"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IconHeart, IconArrowUpRight } from "@tabler/icons-react";
import { toast } from "sonner";

// ✅ wishlist helpers
const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
};

type Product = {
  id: string;
  name: string;
  slug: string;
  bannerImageUrl?: string | null;
  description: string;
  sku: string;
  code?: string;
  productCode?: string;
  createdAt?: string;
};

export default function RelatedProducts({
  categoryID,
  currentProductId,
}: {
  categoryID: string;
  currentProductId: string;
}) {
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/products/${categoryID}/related`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const filtered = data.filter((item) => item.id !== currentProductId);
          setRelated(filtered);
        } else {
          setRelated([]);
        }
      } catch (err) {
        console.error(err);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();

    // ✅ load wishlist
    const items = getWishlist();
    setWishlistIds(items.map((i: any) => i.id));
  }, [categoryID]);

  // ✅ Toggle wishlist
  const handleWishlist = (product: any) => {
    let wishlist = getWishlist();

    const exists = wishlist.find((i: any) => i.id === product.id);

    if (exists) {
      wishlist = wishlist.filter((i: any) => i.id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setWishlistIds(wishlist.map((i: any) => i.id));

      toast("Removed from wishlist ❌");
    } else {
      wishlist.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        bannerImageUrl: product.bannerImageUrl,
        sku: product.sku,
      });

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setWishlistIds(wishlist.map((i: any) => i.id));

      toast.success("Added to wishlist ❤️");
    }
  };

  return (
    <div className="mt-14">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold font-inter">Related Products</h2>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && related.length === 0 && (
        <p className="text-gray-400">No related products found</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-poppins">
        {Array.isArray(related) &&
          related.map((item) => (
            <Link key={item.id} href={`/product/${item.slug}`}>
              <div className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col group">
                {/* Image */}
                <div className="relative w-full h-44">
                  {item.createdAt &&
                    new Date(item.createdAt) >
                      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                      <span className="absolute top-3 left-3 bg-[#FB923C] text-white text-xs px-2 py-1 rounded-full z-10">
                        NEW
                      </span>
                    )}

                  <Image
                    src={item.bannerImageUrl || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-contain group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex flex-col flex-grow">
                  {/* Name */}
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.description || "No description"}
                  </p>

                  {/* Product Code */}
                  <p className="text-black text-sm font-semibold">
                    ProductCode:&nbsp;
                    <span className="text-gray-700 text-xs">
                      {item.code || item.productCode || item.sku || "N/A"}
                    </span>
                  </p>

                  {/* Bottom */}
                  <div className="flex items-center justify-between pt-2 mt-auto">
                    <span className="flex items-center gap-1 text-[#0300A7] font-semibold text-sm">
                      View Specs
                      <IconArrowUpRight size={16} />
                    </span>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleWishlist(item);
                      }}
                      className="border rounded-full p-2 hover:bg-muted transition"
                    >
                      <IconHeart
                        size={18}
                        className={
                          wishlistIds.includes(item.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        }
                      />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
