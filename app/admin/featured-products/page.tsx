"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X, Loader2, Search } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  sku?: string;
  productCode?: string;
  code?: string;
  description?: string;
  bannerImageUrl: string;
  isFeatured: boolean;
};

export default function FeaturedProductsPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch("/api/products/featured");
        const data = await res.json();
        setFeaturedProducts(data || []);
      } catch (error) {
        toast.error("Failed to fetch featured products");
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Fetch all products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products?includeInactive=true");
        const data = await res.json();
        setAllProducts(data || []);
      } catch (error) {
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const handleAddFeatured = async (productId: string) => {
    try {
      setTogglingId(productId);
      const res = await fetch("/api/products/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, isFeatured: true }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Product added to featured");
        // Update featured products list
        const product = allProducts.find((p) => p.id === productId);
        if (product) {
          setFeaturedProducts((prev) => [
            ...prev,
            { ...product, isFeatured: true },
          ]);
        }
        setSearchQuery("");
      }
    } catch (error) {
      toast.error("Failed to add featured product");
    } finally {
      setTogglingId(null);
    }
  };

  const handleRemoveFeatured = async (productId: string) => {
    try {
      const res = await fetch("/api/products/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, isFeatured: false }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Product removed from featured");
        setFeaturedProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (error) {
      toast.error("Failed to remove featured product");
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? allProducts.filter((p) => {
        const isFeatured = featuredProducts.some((fp) => fp.id === p.id);
        if (isFeatured) return false; // Don't show already featured products
        const searchable = [p.name, p.slug, p.brand, p.sku, p.productCode, p.code, p.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(normalizedQuery);
      })
    : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-poppins">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Featured Products
          </h1>
          <p className="text-gray-600">Manage your featured products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Products Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Add Featured Product
              </h2>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, SKU, brand…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>

                {searchQuery && filteredProducts.length > 0 && (
                  <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto shadow-sm">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-3 border-b last:border-b-0 hover:bg-gray-50 flex items-center gap-3"
                      >
                        {product.bannerImageUrl && (
                          <img
                            src={product.bannerImageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover flex-shrink-0 border"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-800 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">{product.sku || product.productCode || product.code || "—"}</p>
                          {product.description && (
                            <p className="text-xs text-gray-400 line-clamp-2">{product.description}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          disabled={togglingId === product.id}
                          onClick={() => handleAddFeatured(product.id)}
                          className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
                        >
                          {togglingId === product.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Add"
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery && filteredProducts.length === 0 && !loading && (
                  <p className="text-sm text-gray-400 px-3 py-4 text-center border border-dashed rounded-lg">
                    No products found matching "{searchQuery}"
                  </p>
                )}

                {!searchQuery && (
                  <p className="text-xs text-gray-400 text-center pt-2">
                    Type to search from {allProducts.length} products
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Featured Products List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">
                  Featured Products ({featuredProducts.length})
                </h2>
              </div>

              {featuredProducts.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No featured products yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Product
                        </th>

                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {featuredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {product.bannerImageUrl && (
                                <img
                                  src={product.bannerImageUrl}
                                  alt={product.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-800">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {product.slug}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveFeatured(product.id)}
                              className="inline-flex items-center gap-2"
                            >
                              <X size={16} />
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
