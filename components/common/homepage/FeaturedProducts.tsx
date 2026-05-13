"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IconHeart, IconArrowUpRight, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";

const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products/featured");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const items = getWishlist();
    setWishlistIds(items.map((i: any) => i.id));
  }, []);

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

  if (loading) {
    return (
      <section className="w-full bg-white font-poppins">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl xl:text-3xl font-bold">
              Featured Products
            </h2>
            <Link
              href="/product/featured"
              className="text-[#007AFF] font-bold flex items-center gap-1 font-poppins text-sm sm:text-base hover:underline"
            >
              View All
              <IconArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-64 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 py-5 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl xl:text-3xl font-bold">Featured Products</h2>
          <Link
            href="/product/featured"
            className="text-[#007AFF] font-bold flex items-center gap-1 font-poppins text-sm sm:text-base hover:underline"
          >
            View All
            <IconArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
          {products.slice(0, 8).map((item: any) => (
            <Link href={`/product/${item.slug}`} key={item.id}>
              <div className="border rounded-xl overflow-hidden hover:shadow-lg transition h-full flex flex-col bg-white">
                {/* Image */}
                <div className="relative w-full h-28 sm:h-40 xl:h-56">
                  <span className="absolute top-2 left-2 bg-[#0300A7] text-white text-[9px] sm:text-xs px-2 py-1 rounded-full z-10 font-semibold">
                    FEATURED
                  </span>

                  <Image
                    src={item.bannerImageUrl || "/image/arival1.png"}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* Content */}
                <div className="p-2 sm:p-4 xl:p-6 space-y-2 sm:space-y-3 flex flex-col flex-1">
                  <h3 className="text-[12px] sm:text-base xl:text-lg font-semibold line-clamp-2 min-h-[34px] sm:min-h-[48px] leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-[10px] sm:text-sm text-gray-500 line-clamp-2 min-h-[28px] sm:min-h-[40px]">
                    {item.shortDescription}
                  </p>

                  <div className="flex justify-between items-center mt-auto">
                    <span className="flex items-center gap-1 text-[#0300A7] font-semibold text-[10px] sm:text-sm">
                      View Specs
                      <IconArrowUpRight size={12} />
                    </span>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleWishlist(item);
                      }}
                      className="border rounded-full p-1.5 sm:p-2 hover:bg-gray-100 transition"
                    >
                      <IconHeart
                        size={14}
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
    </section>
  );
};

export default FeaturedProducts;
