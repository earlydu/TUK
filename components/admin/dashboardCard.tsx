"use client";

import { ShoppingCart, Package, Truck, Boxes } from "lucide-react";
import { StatCard } from "./statCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RecentProduct = {
  id: string;
  name: string;
  bannerImageUrl: string;
  price: number;
  categoryId: string;
  stock: number;
  sku: string;
};

type RecentCategory = {
  id: string;
  name: string;
  image: string;
  items: number;
  featured: boolean;
};

export function DashboardCards() {
  const [stats, setStats] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  // ✅ Fetch both APIs together
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/dashboard/recent"),
        ]);

        const statsData = await statsRes.json();
        const recentData = await recentRes.json();

        setStats(statsData);
        setData(recentData);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchAll();
  }, []);

  // ✅ Single loading state
  if (!stats || !data) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  const recentProducts =
    data?.recentCategories?.flatMap((cat: any) => cat.products) || [];
  const recentCategories = data?.recentCategories || [];

  // ✅ Format Data
  const formattedProducts = recentProducts.map((p: RecentProduct) => ({
    id: p.id,
    name: p.name,
    image: p.bannerImageUrl || "/no-image.png", // ✅ FIXED
    price: `₹${p.price}`,
    category: p.categoryId,
    sku: p.sku,
    stock: p.stock || 0,
    status:
      p.stock > 10 ? "Active" : p.stock > 0 ? "Low stock" : "Out of stock",
  }));

  const formattedCategories = recentCategories.map((c: any) => ({
    id: c.id,
    name: c.name,
    image: c.image || "/no-image.png",
    items: c.items || 0,
    featured: c.featured || false,
    products: c.products || [],
  }));

  return (
    <div>
      {/* 🔹 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Categories"
          value={stats.totalCategories}
          subtitle="Live data"
          icon={<ShoppingCart className="text-sky-500" size={24} />}
          iconBg="bg-sky-100/50"
        />

        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          subtitle="Live data"
          icon={<Package className="text-purple-500" size={24} />}
          iconBg="bg-purple-100/50"
        />

        <StatCard
          title="Total Related Products"
          value={stats.totalRelatedProducts}
          subtitle="Live data"
          icon={<Boxes className="text-yellow-500" size={24} />}
          iconBg="bg-yellow-100/50"
        />

        <StatCard
          title="Total Distributors"
          value={stats.totalDistributors}
          subtitle="Live data"
          icon={<Truck className="text-emerald-500" size={24} />}
          iconBg="bg-emerald-100/50"
        />
      </div>

      {/* 🔹 Recent Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Products */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Recent Products</CardTitle>
              <Badge>{formattedProducts.length} new</Badge>
            </div>
          </CardHeader>

          <CardContent>
            {formattedProducts.map((p: any) => (
              <div key={p.id} className="flex gap-3 p-3 border-b items-center">
                <img
                  src={p.image || "/no-image.png"}
                  alt={p.name}
                  className="h-12 w-20 rounded-lg object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/no-image.png";
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.sku}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => router.push(`/admin/Product/edit/${p.id}`)}
                >
                  Edit
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Recent Categories</CardTitle>
              <Badge>{formattedCategories.length} new</Badge>
            </div>
          </CardHeader>

          <CardContent>
            {formattedCategories.map((c: any) => (
              <div key={c.id} className="flex gap-3 p-3 border-b">
                <img src={c.image} className="h-12 w-20 rounded" />
                <div className="flex-1">
                  <p className="font-medium">{c.name}</p>

                  {/* 🔥 Associated Products */}
                  {/* <Badge variant="outline" className="mt-2">
  {c.products?.length || 0} Products
</Badge> */}
                </div>
                {/* <Badge>{c.featured ? "Featured" : "Standard"}</Badge> */}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
