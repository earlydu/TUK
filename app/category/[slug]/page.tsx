"use client";

import { Suspense } from "react";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import FilterSide from "@/components/common/category/FilterSide";
import CategoryDefine from "@/components/common/category/CategoryDefine";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function CategorySlugPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.slug as string);

  const [sort, setSort] = useState("latest");
  const [category, setCategory] = useState("All Categories");
  const [categories, setCategories] = useState<any[]>([]);

  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory);
  }, []);

  const handleCategoriesLoad = useCallback(
    (data: any[]) => {
      setCategories(data);
      // Find the category matching the slug from URL
      const matched = data.find(
        (c: any) => c.slug === slug || encodeURIComponent(c.name) === slug
      );
      if (matched) {
        setCategory(matched.name);
      }
    },
    [slug]
  );

  return (
    <>
      <Header />

      {/* BREADCRUMB */}
      <div className="w-full bg-gray-100 border-b font-poppins">
        <div
          className="relative w-full h-72 text-center flex flex-col items-center justify-center gap-3 text-white"
          style={{
            background: "linear-gradient(to right, #141D3D, #364FA3)",
          }}
        >
          <Image
            alt="Hero Background"
            src="/graph1.jpeg"
            className="absolute top-0 left-0 w-full h-full z-10 opacity-20"
            width={1920}
            height={100}
          />
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-semibold font-poppins">
            Products
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80 max-w-2xl mx-auto font-poppins">
            Explore our wide range of categories and Products
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>›</span>
          <Link href="/category" className="hover:text-black">
            Products
          </Link>
          <span>›</span>
          <span className="text-black font-medium">{category}</span>
        </div>
      </div>

      <section className="bg-gray-100 w-full py-1 lg:py-10 font-poppins text-sm">
        <div className="max-w-6xl mx-auto px-4">
          {/* MOBILE FILTER */}
          <div className="lg:hidden flex items-center justify-between gap-3 mb-6 bg-white p-3 rounded-xl shadow-sm">
            <select
              value={category}
              onChange={(e) => {
                const value = e.target.value;
                setCategory(value);
                if (value === "All Categories") {
                  window.history.pushState(null, "", "/category");
                } else {
                  const selected = categories.find((c: any) => c.name === value);
                  if (selected) {
                    const slug = selected.slug || encodeURIComponent(selected.name);
                    window.history.pushState(null, "", `/category/${slug}`);
                  }
                }
              }}
              className="border rounded-lg px-3 py-2 text-sm bg-white w-1/2"
            >
              <option value="All Categories">All Categories</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-white w-1/2"
            >
              <option value="latest">Latest</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* SIDEBAR */}
            <div className="hidden lg:block lg:w-1/4 lg:sticky lg:top-24 h-fit">
              <FilterSide
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
              />
            </div>

            {/* PRODUCTS */}
            <div className="lg:w-3/4">
              <CategoryDefine
                category={category}
                sort={sort}
                setSort={setSort}
                onCategoriesLoad={handleCategoriesLoad}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
