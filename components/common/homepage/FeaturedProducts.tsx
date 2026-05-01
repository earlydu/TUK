"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IconHeart, IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";

// ✅ helper
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

    // ✅ load wishlist
    const items = getWishlist();
    setWishlistIds(items.map((i: any) => i.id));
  }, []);

  // ✅ toggle wishlist
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
    return <p className="text-center py-10">Loading featured products...</p>;
  }

  return (
    <section className="w-full bg-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 py-5 space-y-10">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl xl:text-3xl font-bold">Featured Products</h2>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {products.slice(0, 4).map((item: any) => (
            <Link href={`/product/${item.slug}`} key={item.id}>
              {/* Card */}
              <div className="border rounded-xl overflow-hidden hover:shadow-lg transition h-full flex flex-col">
                {/* Image */}
                <div className="relative w-full h-56">
                  <span className="absolute top-4 left-4 bg-[#0300A7] text-white text-xs px-3 py-1 rounded-full z-10">
                    FEATURED
                  </span>

                  <Image
                    src={item.bannerImageUrl || "/image/arival1.png"}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.shortDescription}
                  </p>

                  {/* Bottom fixed */}
                  <div className="flex justify-between items-center mt-auto">
                    <span className="flex items-center gap-1 text-[#0300A7] font-semibold text-sm">
                      View Specs
                      <IconArrowUpRight size={16} />
                    </span>

                    {/* ❤️ Wishlist */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleWishlist(item);
                      }}
                      className="border rounded-full p-2 hover:bg-gray-100 transition"
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

export default FeaturedProducts;
