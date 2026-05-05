"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IconHeart, IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";

// ✅ wishlist helpers
const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
};

const Arrivals = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products/new-arrivals");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // ✅ load wishlist
    const items = getWishlist();
    setWishlistIds(items.map((i: any) => i.id));
  }, []);

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

  if (loading) {
    return (
      <section className="w-full bg-white font-poppins">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 xl:px-8 py-3 space-y-10">
          <div className="text-center">
            <h2 className="text-2xl xl:text-3xl font-bold">New Arrivals</h2>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl h-80 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 xl:px-8 py-3 space-y-10">
        <div className="text-center">
          <h2 className="text-2xl xl:text-3xl font-bold">New Arrivals</h2>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6 items-stretch">
          {products.slice(0, 4).map((item: any) => (
            <Link key={item.id} href={`/product/${item.slug}`}>
              <div className="bg-background border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                <div className="relative w-full h-28 sm:h-40 xl:h-56">
                  <span className="absolute top-2 left-2 bg-[#FB923C] text-white text-[9px] sm:text-xs px-2 py-1 rounded-full z-10 font-semibold">
                    NEW
                  </span>

                  <Image
                    src={item.bannerImageUrl || "/image/arival1.png"}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="p-2 sm:p-4 xl:p-6 space-y-2 sm:space-y-3 flex flex-col flex-grow">
                  <h3 className="text-[12px] sm:text-base xl:text-lg font-semibold leading-snug line-clamp-2 min-h-[32px] sm:min-h-[48px]">
                    {item.name}
                  </h3>

                  <p className="text-black text-[10px] sm:text-sm font-semibold">
                    ProductCode:&nbsp;
                    <span className="text-gray-700 text-[9px] sm:text-xs">
                      {item.productCode || item.sku || "N/A"}
                    </span>
                  </p>

                  <div className="flex items-center justify-between mt-auto">
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
                      className="border rounded-full p-1.5 sm:p-2 hover:bg-muted transition"
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

export default Arrivals;
