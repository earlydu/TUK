"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import ProductDefine from "@/components/common/product/ProductDefine";
import FilterSide from "@/components/common/category/FilterSide";
import { CategoryFilter } from "../category/CategoryFilter";

export default function Page() {
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState("latest");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(`${baseUrl}/api/products`);
        if (response.ok) {
          const data = await response.json();
          // Map API data to UI format
          const mappedProducts = data.map((product: any) => ({
            id: product.id,
            title: product.name,
            code: product.productcode,
            category:
              typeof product.category === "object"
                ? product.category?.name
                : product.category || "",
            image: product.bannerImageUrl || "",
            new: false,
            slug: product.slug,
            description: product.shortDescription,
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  const handleCategoriesLoad = (data: any[]) => {
    setCategories(data);
  };
  const filteredProducts = products.filter((product) => {
    if (category === "All Categories") return true;

    const normalize = (val: any) => val?.toString().toLowerCase().trim();

    const selected = normalize(category);

    // handle string
    if (typeof product.category === "string") {
      return normalize(product.category).includes(selected);
    }

    // handle array
    if (Array.isArray(product.category)) {
      return product.category.some((cat: any) =>
        normalize(cat).includes(selected),
      );
    }

    return false;
  });

  console.log("Selected category:", category);
  console.log("Products:", products);
  return (
    <>
      <Header />

      <div className="w-full bg-gray-100 font-poppins ">
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
      <Suspense fallback={<div className="w-full h-96 bg-gray-100" />}>
        <CategoryFilter
          onCategoryChange={handleCategoryChange}
          onCategoriesLoad={handleCategoriesLoad}
        />
      </Suspense>
      <section className="bg-gray-100 w-full py-1 lg:py-10 font-poppins text-sm">
        <div className="max-w-6xl mx-auto px-4">
          {/* MOBILE FILTER BAR */}

          <div className="lg:hidden flex items-center gap-3 mb-6">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm bg-white"
            >
              <option value="All Categories">All</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm bg-white font-poppins"
            >
              <option value="latest">Latest</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* SIDEBAR */}

            <div className="  lg:w-1/4 lg:sticky lg:top-24 h-fit">
              <FilterSide
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
                products={products}
              />
            </div>

            {/* PRODUCTS */}

            <div className="lg:w-3/4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-500">Loading products...</p>
                </div>
              ) : (
                <ProductDefine
                  category={category}
                  sort={sort}
                  setSort={setSort}
                  products={filteredProducts}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
