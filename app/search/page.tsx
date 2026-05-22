"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/common/header";

type Product = {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  productCode: string;
  description?: string;
  isActive?: boolean;
};

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      fetchResults(query);
    }
  }, [query]);

  const fetchResults = async (search: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${search}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 xl:px-8 py-8 font-poppins">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-600">
          {query ? `Results for "${query}"` : "Enter a search query"}
        </p>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group"
            >
              <div className="bg-background border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={product.image || "/image/no-image.png"}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                    onError={(e) => {
                      (e.currentTarget as any).src = "/image/no-image.png";
                    }}
                  />
                </div>

                <div className="p-4 space-y-2 flex flex-col flex-grow">
                  <h3 className="text-base font-semibold line-clamp-2 min-h-[48px] group-hover:text-primary">
                    {product.name}
                  </h3>

                  <div className="flex flex-wrap gap-2 items-center">
                    <p className="text-black text-sm font-semibold">
                      ProductCode:&nbsp;
                      <span className="text-gray-700 text-xs">
                        {product.productCode || "N/A"}
                      </span>
                    </p>
                    {!product.isActive && (
                      <span className="rounded-full bg-yellow-100 text-yellow-700 px-2 py-0.5 text-[10px] uppercase tracking-wider">
                        Unpublished
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-xs">
                    {product.category || "Uncategorized"}
                  </p>
                  {product.description && (
                    <p className="text-gray-600 text-xs line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found for "{query}"</p>
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="max-w-6xl mx-auto px-4 sm:px-6 xl:px-8 py-8 font-poppins">
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </>
  );
}
