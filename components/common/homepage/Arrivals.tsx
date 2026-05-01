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
        // First try admin-curated new products
        const newRes = await fetch("/api/products/new");
        const newData = await newRes.json();

        if (Array.isArray(newData) && newData.length > 0) {
          setProducts(newData);
        } else {
          // Fallback: latest products by createdAt
          const res = await fetch("/api/products/new-arrivals");
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // Hard fallback
        try {
          const res = await fetch("/api/products/new-arrivals");
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        } catch {}
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

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8 items-stretch">
          {products.slice(0, 4).map((item: any) => (
            <Link key={item.id} href={`/product/${item.slug}`}>
              <div className="bg-background border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                <div className="relative w-full h-56">
                  {/* Always show NEW badge for admin-curated products */}
                  <span className="absolute top-4 left-4 bg-[#FB923C] text-white text-xs px-3 py-1 rounded-full z-10 font-semibold">
                    NEW
                  </span>

                  <Image
                    src={item.bannerImageUrl || "/image/arival1.png"}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="p-6 space-y-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold">{item.name}</h3>

                  {/* <p className="text-gray-500 text-sm line-clamp-3">
                    {item.description ||
                      item.shortDescription ||
                      "No description"}
                  </p> */}

                  <p className="text-black text-sm font-semibold">
                    ProductCode:&nbsp;
                    <span className="text-gray-700 text-xs">
                      {item.productCode || item.sku || "N/A"}
                    </span>
                  </p>

                  <div className="flex items-center justify-between  mt-auto">
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
    </section>
  );
};

export default Arrivals;
