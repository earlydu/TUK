"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconHeart, IconArrowUpRight } from "@tabler/icons-react";
import { toast } from "sonner";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
};

export default function FeaturedProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products/featured");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setProducts([]);
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

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <div className="w-full bg-gray-100 font-poppins">
        <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>›</span>
          <Link href="/product" className="hover:text-black">
            Products
          </Link>
          <span>›</span>
          <span className="text-black font-medium">Featured Products</span>
        </div>
      </div>

      {/* Page Content */}
      <section className="w-full bg-gray-50 min-h-screen font-poppins">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 xl:px-8 py-10 space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-gray-900">
              Featured Products
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Discover our hand-picked selection of top-performing products.
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl h-72 sm:h-80 animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                No featured products at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((item: any) => (
                <Link href={`/product/${item.slug}`} key={item.id}>
                  <div className="border rounded-xl overflow-hidden hover:shadow-lg transition h-full flex flex-col bg-white cursor-pointer">
                    {/* Image */}
                    <div className="relative w-full h-32 sm:h-44 xl:h-56">
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
                    <div className="p-3 sm:p-4 xl:p-6 space-y-2 sm:space-y-3 flex flex-col flex-1">
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
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
