"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconHeart } from "@tabler/icons-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
};

const ProductDefine = ({ category, sort, setSort }: any) => {
  const [products, setProducts] = useState<any[]>([]);
  const [newProductIds, setNewProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const productsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, newRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/products/new"),
        ]);
        const data = await prodRes.json();
        const newData = await newRes.json();
        setProducts(data);
        setNewProductIds(
          (Array.isArray(newData) ? newData : []).map((p: any) => p.id),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

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

      toast.error("Removed from wishlist ❌");
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

  const getProductCode = (product: any) => {
    return (
      product.code ||
      product.productCode ||
      product.sku ||
      product.product_code ||
      "N/A"
    );
  };

  let filtered =
    category === "All Categories"
      ? products
      : products.filter((p: any) => p.category === category);

  if (sort === "name") {
    filtered = filtered.sort((a: any, b: any) =>
      (a.name || "").localeCompare(b.name || ""),
    );
  }

  const getPagination = (page: number, totalPages: number) => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // show all if small
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const visibleProducts = filtered.slice(start, end);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="font-poppins">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-semibold">{category}</h2>

          <p className="text-gray-500 mt-1">
            Showing {filtered.length} results
          </p>
        </div>

        <div className="hidden xl:flex items-center gap-3">
          <span className="text-gray-500 text-sm">Sort by:</span>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-auto">
              <SelectValue placeholder="Latest " />
            </SelectTrigger>

            <SelectContent className="font-poppins">
              <SelectItem value="Latest">Latest </SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {visibleProducts.map((product: any) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition block"
          >
            <div className="relative">
              {newProductIds.includes(product.id) && (
                <span className="absolute top-3 left-3 bg-[#FB923C] text-white text-xs px-3 py-1 rounded-full">
                  NEW
                </span>
              )}

              <Image
                src={product.bannerImageUrl}
                alt={product.name}
                width={500}
                height={400}
                className="w-auto h-32 sm:h-44 object-contain"
              />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-semibold">{product.name}</h3>

              <p className="text-black text-xs font-bold">
                ProductCode:&nbsp;
                <span className="text-gray-700 text-xs">
                  {getProductCode(product)}
                </span>
              </p>

              {/* ✅ UPDATED ROW */}
              <div className="flex items-center justify-between">
                <Button
                  variant="link"
                  className="p-0 text-[#0300A7] flex items-center gap-2"
                >
                  View <IconArrowRight size={18} />
                </Button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleWishlist(product);
                  }}
                  className="border rounded-full p-2 hover:bg-muted transition"
                >
                  <IconHeart
                    size={18}
                    className={
                      wishlistIds.includes(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }
                  />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* PAGINATION */}
      {/* <Pagination className="mt-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={page === i + 1}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}

      <Pagination className="mt-10 ">
        <PaginationContent className="flex flex-wrap justify-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            />
          </PaginationItem>

          {getPagination(page, totalPages).map((item, index) => (
            <PaginationItem key={index}>
              {item === "..." ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <PaginationLink
                  isActive={page === item}
                  onClick={() => setPage(item as number)}
                  className="min-w-9 text-center"
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProductDefine;
