"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type SortColumn =
  | "name"
  | "category"
  | "productCode"
  | "createdAt"
  | "isActive";

type SortDirection = "asc" | "desc";

export function ProductsPageClient() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products?includeInactive=true");
      const data = await res.json();

      // If returning from an edit, float that product to the top
      const recentId = searchParams.get("recentId");
      if (recentId) {
        const idx = data.findIndex((p: any) => p.id === recentId);
        if (idx > 0) {
          const [edited] = data.splice(idx, 1);
          data.unshift(edited);
        }
        // Clean the URL without causing a navigation
        window.history.replaceState({}, "", "/admin/Product");
      }

      setProducts(data);
    };

    fetchProducts();
    // Intentionally run once: removing `recentId` from the URL should not trigger
    // another fetch that would undo the "move to top" UI behavior.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      toast("Product deleted");
      // remove from UI instantly
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      toast("Delete failed");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      setDuplicatingId(id);
      const res = await fetch(`/api/products/duplicate/${id}`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`"${data.product.name}" created ✓`);
        // Prepend the new product to the top of the list
        setProducts((prev) => [data.product, ...prev]);
      } else {
        toast.error(data.error || "Duplication failed");
      }
    } catch {
      toast.error("Failed to duplicate product");
    } finally {
      setDuplicatingId(null);
    }
  };

  const togglePublishStatus = async (id: string, publish: boolean) => {
    try {
      setPublishingId(id);
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: publish }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Product ${publish ? "published" : "unpublished"}`);
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id ? { ...product, isActive: publish } : product,
          ),
        );
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setPublishingId(null);
    }
  };

  const toggleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortColumn(column);
    setSortDirection(column === "createdAt" ? "desc" : "asc");
  };

  const sortedProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filtered = !normalizedQuery
      ? products
      : products.filter((p) => {
          const searchable = [p.name, p.slug, p.brand, p.sku, p.productCode]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return searchable.includes(normalizedQuery);
        });

    return [...filtered].sort((a, b) => {
      const compareText = (left: any, right: any) =>
        String(left || "").localeCompare(String(right || ""), undefined, {
          sensitivity: "base",
        });

      let result = 0;

      if (sortColumn === "name") {
        result = compareText(a.name, b.name);
      } else if (sortColumn === "category") {
        result = compareText(a.category, b.category);
      } else if (sortColumn === "productCode") {
        result = compareText(a.productCode, b.productCode);
      } else if (sortColumn === "createdAt") {
        result =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortColumn === "isActive") {
        result = Number(a.isActive) - Number(b.isActive);
      }

      return sortDirection === "asc" ? result : -result;
    });
  }, [products, searchQuery, sortColumn, sortDirection]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-barlow">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between">
          <h2 className=" w-full text-lg font-bold mb-6">All Products</h2>
          <div className="relative w-full max-w-sm mr-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products..."
              className=" w-full border hidden lg:block border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            onClick={() =>
              (window.location.href = "/admin/Product/add-product")
            }
            className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg "
          >
            Add Product
          </Button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search products..."
          className=" w-full border lg:hidden block border-gray-300 mb-4 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">
                  <button
                    type="button"
                    onClick={() => toggleSort("name")}
                    className="inline-flex items-center gap-1 font-semibold text-left"
                  >
                    Name
                    <span className="text-xs text-gray-500">
                      {sortColumn === "name"
                        ? sortDirection === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </span>
                  </button>
                </th>
                <th className="p-3">
                  <button
                    type="button"
                    onClick={() => toggleSort("category")}
                    className="inline-flex items-center gap-1 font-semibold text-left"
                  >
                    Category
                    <span className="text-xs text-gray-500">
                      {sortColumn === "category"
                        ? sortDirection === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </span>
                  </button>
                </th>
                <th className="p-3 w-32">
                  <button
                    type="button"
                    onClick={() => toggleSort("productCode")}
                    className="inline-flex items-center gap-1 font-semibold text-left"
                  >
                    Product Code
                    <span className="text-xs text-gray-500">
                      {sortColumn === "productCode"
                        ? sortDirection === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </span>
                  </button>
                </th>
                <th className="p-3">
                  <button
                    type="button"
                    onClick={() => toggleSort("createdAt")}
                    className="inline-flex items-center gap-1 font-semibold text-left"
                  >
                    Date Added
                    <span className="text-xs text-gray-500">
                      {sortColumn === "createdAt"
                        ? sortDirection === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </span>
                  </button>
                </th>
                <th className="p-3">
                  <button
                    type="button"
                    onClick={() => toggleSort("isActive")}
                    className="inline-flex items-center gap-1 font-semibold text-left"
                  >
                    Status
                    <span className="text-xs text-gray-500">
                      {sortColumn === "isActive"
                        ? sortDirection === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </span>
                  </button>
                </th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody className="items-center">
              {sortedProducts.map((p) => (
                <tr key={p.id} className="border-t ">
                  <td className="p-3">
                    {p.bannerImageUrl ? (
                      <img
                        src={p.bannerImageUrl}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </td>

                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">
                    {p.category ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        {p.category}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No category</span>
                    )}
                  </td>
                  <td
                    className="p-3 w-32 max-w-[180px]   "
                    title={p.productCode}
                  >
                    {p.productCode}
                  </td>
                  <td className="p-3 ">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {p.isActive ? "Published" : "Unpublished"}
                    </span>
                  </td>

                  <td className="p-3 flex flex-wrap gap-2 mt-4">
                    <Button
                      onClick={() => router.push(`/admin/Product/edit/${p.id}`)}
                      className="cursor-pointer rounded"
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={publishingId === p.id}
                      onClick={() => togglePublishStatus(p.id, !p.isActive)}
                      className="gap-1.5 cursor-pointer"
                    >
                      {publishingId === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : p.isActive ? (
                        "Unpublish"
                      ) : (
                        "Publish"
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={duplicatingId === p.id}
                      onClick={() => handleDuplicate(p.id)}
                      className="gap-1.5 cursor-pointer"
                    >
                      {duplicatingId === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      Duplicate
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button
                          variant="destructive"
                          className="px-3 py-1 cursor-pointer text-sm font-medium  rounded "
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the category.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>

                          <AlertDialogAction onClick={() => handleDelete(p.id)}>
                            Yes, Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
