"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, PackagePlus, Search, Sparkles, X } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  brand: string;
  sku: string;
  productCode: string;
  bannerImageUrl: string;
  isActive: boolean;
};

export default function NewProductsPage() {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  /* ─── fetch new products ─── */
  const fetchNewProducts = async () => {
    try {
      const res = await fetch("/api/products/new");
      const data = await res.json();
      setNewProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch new products");
    }
  };

  /* ─── fetch all products ─── */
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products?includeInactive=true");
      const data = await res.json();
      setAllProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewProducts();
    fetchAllProducts();
  }, []);

  /* ─── add to new products ─── */
  const handleAdd = async (productId: string) => {
    try {
      setTogglingId(productId);
      const res = await fetch("/api/products/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, isNew: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product marked as New ✓");
        const product = allProducts.find((p) => p.id === productId);
        if (product) {
          setNewProducts((prev) => [...prev, product]);
        }
        setSearchQuery("");
      }
    } catch {
      toast.error("Failed to add product");
    } finally {
      setTogglingId(null);
    }
  };

  /* ─── remove from new products ─── */
  const handleRemove = async (productId: string) => {
    try {
      setTogglingId(productId);
      const res = await fetch("/api/products/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, isNew: false }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product removed from New Products");
        setNewProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch {
      toast.error("Failed to remove product");
    } finally {
      setTogglingId(null);
    }
  };

  /* ─── filter search results ─── */
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? allProducts.filter((p) => {
        const alreadyNew = newProducts.some((np) => np.id === p.id);
        if (alreadyNew) return false;
        const searchable = [
          p.name,
          p.slug,
          p.brand,
          p.sku,
          p.productCode,
          p.description,
        ]
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
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">New Products</h1>
          </div>
          <p className="text-gray-500 ml-14">
            Products marked here will show a{" "}
            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              NEW
            </span>{" "}
            badge on the homepage "New Arrivals" section
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ──── Search & Add Panel ──── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <PackagePlus className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Add New Product
                </h2>
              </div>

              <div className="space-y-3">
                {/* Search input */}
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

                {/* Search results dropdown */}
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
                          <p className="text-xs text-gray-400">
                            {product.sku || product.productCode || "—"}
                          </p>
                          {product.description && (
                            <p className="text-xs text-gray-400 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          disabled={togglingId === product.id}
                          onClick={() => handleAdd(product.id)}
                          className="bg-orange-500 hover:bg-orange-600 text-white flex-shrink-0"
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

          {/* ──── New Products List ──── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {/* Table header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  New Products{" "}
                  <span className="ml-2 bg-orange-100 text-orange-600 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                    {newProducts.length}
                  </span>
                </h2>
                <span className="text-xs text-gray-400">
                  Showing on homepage with NEW badge
                </span>
              </div>

              {newProducts.length === 0 ? (
                <div className="p-12 text-center">
                  <Sparkles className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No products marked as New yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Search and add products using the panel on the left
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          SKU / Code
                        </th>

                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {newProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {product.bannerImageUrl ? (
                                <img
                                  src={product.bannerImageUrl}
                                  alt={product.name}
                                  className="w-11 h-11 rounded-lg object-cover border"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center">
                                  <PackagePlus className="h-5 w-5 text-gray-300" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-800 text-sm">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {product.slug}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.sku || product.productCode || "—"}
                          </td>

                          <td className="px-6 py-4 text-center">
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={togglingId === product.id}
                              onClick={() => handleRemove(product.id)}
                              className="inline-flex items-center gap-1.5"
                            >
                              {togglingId === product.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <X className="h-3.5 w-3.5" />
                              )}
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
