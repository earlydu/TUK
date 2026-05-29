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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical } from "lucide-react";
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

        <div className="bg-white rounded-xl shadow mt-6">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-44 max-w-44">Image</TableHead>
                <TableHead className=" w-44 max-w-44">Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className=" w-44 max-w-44">Product Code</TableHead>
                <TableHead className="w-40">Date Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="p-3 align-middle">
                    {p.bannerImageUrl ? (
                      <img
                        src={p.bannerImageUrl}
                        alt={p.name}
                        className="max-w-20 h-16 object-contain "
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="p-3 w-[280px] max-w-[280px] font-medium align-middle whitespace-normal break-words">
                    <p className="whitespace-normal break-words leading-snug">
                      {p.name}
                    </p>
                  </TableCell>
                  <TableCell className="p-3 align-middle">
                    {p.category ? (
                      <div className="flex flex-wrap gap-1">
                        {p.category.split(", ").map((cat: string, i: number) => (
                          <span key={i} className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                            {cat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No category</span>
                    )}
                  </TableCell>
                  <TableCell className="p-3 w-[200px] max-w-[200px]  align-middle whitespace-normal break-words">
                    <p className="whitespace-normal break-words leading-snug">
                      {p.productCode}
                    </p>
                  </TableCell>
                  <TableCell className="p-3 align-middle">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="p-3 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {p.isActive ? "Published" : "Unpublished"}
                    </span>
                  </TableCell>
                  {/* <TableCell className="p-3 text-right align-middle space-x-2">
                    <Button
                      size="sm"
                      className="rounded"
                      onClick={() => router.push(`/admin/Product/edit/${p.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={publishingId === p.id}
                      onClick={() => togglePublishStatus(p.id, !p.isActive)}
                      className="gap-1.5"
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
                      className="gap-1.5"
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
                          size="sm"
                          className="rounded"
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
                  </TableCell> */}
                  <TableCell className="p-3 text-right align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-44 font-barlow"
                      >
                        {/* EDIT */}
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/Product/edit/${p.id}`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>

                        {/* PUBLISH / UNPUBLISH */}
                        <DropdownMenuItem
                          disabled={publishingId === p.id}
                          onClick={() => togglePublishStatus(p.id, !p.isActive)}
                          className="flex items-center gap-2"
                        >
                          {publishingId === p.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : null}

                          {p.isActive ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>

                        {/* DUPLICATE */}
                        <DropdownMenuItem
                          disabled={duplicatingId === p.id}
                          onClick={() => handleDuplicate(p.id)}
                          className="flex items-center gap-2"
                        >
                          {duplicatingId === p.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          Duplicate
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* DELETE */}
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="rounded"
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
                                This action cannot be undone. This will
                                permanently delete the category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(p.id)}
                              >
                                Yes, Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
