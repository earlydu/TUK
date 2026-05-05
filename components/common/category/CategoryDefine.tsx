"use client";

import { IconHeart } from "@tabler/icons-react";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  getWishlist,
} from "@/src/lib/wishlist";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { toast } from "sonner"; // ✅ ADDED

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
import Link from "next/link";

const CategoryDefine = ({ category, sort, setSort }: any) => {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [newProductIds, setNewProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const items = getWishlist();
    setWishlistIds(items.map((i: any) => i.id));
  }, []);

  // ✅ UPDATED FUNCTION
  const handleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      const updated = removeFromWishlist(product.id);
      setWishlistIds(updated.map((i: any) => i.id));

      // ❌ remove toast
      toast.error("Removed from wishlist ❌");
    } else {
      const updated = addToWishlist(product);
      setWishlistIds(updated.map((i: any) => i.id));

      // ❤️ add toast
      toast.success("Added to wishlist ❤️");
    }
  };

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
  const [page, setPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, newRes] = await Promise.all([
          fetch("/api/category"),
          fetch("/api/products"),
          fetch("/api/products/new"),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();
        const newData = await newRes.json();

        setCategoryList(catData);
        setProducts(prodData);
        setNewProductIds(
          (Array.isArray(newData) ? newData : []).map((p: any) => p.id),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sort]);

  const selectedCat = categoryList.find((c: any) => c.name === category);

  let filtered =
    category === "All Categories"
      ? products
      : products.filter(
          (p: any) => String(p.categoryId) === String(selectedCat?.id),
        );

  if (sort === "name") {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const visibleProducts = filtered.slice(start, end);

  if (loading) {
    return <p className="text-center py-10">Loading products...</p>;
  }

  return (
    <div className="font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-semibold">{category}</h2>
          <p className="text-gray-500 mt-1 font-poppins not-only:">
            Showing {filtered.length} results
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <span className="text-gray-500 text-sm font-poppins">Sort by:</span>

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

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {visibleProducts.map((item: any) => (
          <Link
            href={`/product/${item.slug}`}
            key={item.id}
            className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition block"
          >
            <div className="relative">
              {newProductIds.includes(item.id) && (
                <span className="absolute top-3 left-3 bg-[#FB923C] text-white text-xs px-3 py-1 rounded-full">
                  NEW
                </span>
              )}

              <Image
                src={item.bannerImageUrl || "/image/category.png"}
                alt={item.name}
                width={500}
                height={400}
                className="w-full h-32 sm:h-44 object-cover"
              />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-semibold">{item.name}</h3>

              <p className="text-black text-sm font-semibold">
                ProductCode:&nbsp;
                <span className="text-gray-700 text-xs">
                  {item.code || item.productCode || item.sku || "N/A"}
                </span>
              </p>

              <div className="flex justify-between ">
                <div>
                  <span className="text-[#0300A7] flex items-center gap-2 text-sm">
                    View <IconArrowRight size={16} />
                  </span>
                </div>
                <div>
                  <IconHeart
                    className={`cursor-pointer ${
                      wishlistIds.includes(item.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleWishlist(item);
                    }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

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

export default CategoryDefine;
