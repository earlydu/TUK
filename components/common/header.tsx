"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { IconMenu2, IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import EnquiryModal from "./EnquiryModal";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/category" },
  { name: "About", href: "/about" },
  { name: "Wishlist", href: "/wishlist" },
  { name: "Distributor", href: "/distributor" },
  { name: "Contact", href: "/contact-us" },
];

type Product = {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  productCode: string;
};

export default function Header() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        fetchResults(query);
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delay);
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
  const router = useRouter();
  return (
    <header className="relative w-full border-b bg-white font-barlow ">
      <div className="container mx-auto flex items-center justify-between py-2 px-4 lg:px-6 xl:px-8">
        {/* Logo */}
        <Link href="/" className="flex ">
          <Image src="/logo.png" alt="logo" width={200} height={64} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="font-medium text-sm text-black hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center border rounded-full overflow-hidden">
            <Input
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                }
              }}
              className="border-none focus-visible:ring-0 shadow-none"
            />

            <Button
              size="icon"
              onClick={() => {
                if (query.trim()) {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                }
              }}
              className="bg-orange-500 cursor-pointer hover:bg-orange-600 rounded-none"
            >
              <IconSearch size={18} />
            </Button>
          </div>

          {/* <Button
            onClick={() => router.push("/category")}
            variant="outline"
            className="cursor-pointer"
          >
            View all products
          </Button> */}

          {/* Dropdown */}
          {query && (
            <div className="absolute top-22 w-56 bg-white border mt-2 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {loading ? (
                <p className="p-3 text-sm">Searching...</p>
              ) : results.length > 0 ? (
                results.map((item) => (
                  <div
                    onClick={() => router.push(`/product/${item.slug}`)}
                    key={item.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                      <p className="text-xs text-gray-500">
                        {item.productCode}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-3 text-sm text-gray-500">No results found</p>
              )}
              {query && (
                <div className="border-t p-2">
                  <button
                    onClick={() => router.push(`/category`)}
                    className="w-full text-center text-sm text-orange-500 font-medium hover:text-orange-600 py-2"
                  >
                    View all products
                  </button>
                </div>
              )}
            </div>
          )}

          {/* <Button className="rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A] text-xs px-6 h-8">
        Enquiries
    </Button> */}
          <EnquiryModal />
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-2 font-poppins relative">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="cursor-pointer"
          >
            <IconSearch size={20} />
          </Button>

          <Sheet>
            <SheetTrigger>
              <div className="cursor-pointer">
                <IconMenu2 size={22} />
              </div>
            </SheetTrigger>

            <SheetContent side="left">
              <div className="flex flex-col gap-5 px-5 py-5 font-barlow">
                <nav className="flex flex-col gap-4">
                  {navLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-base font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <Button
                  onClick={() => router.push("/category")}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer text-xs"
                >
                  View all products
                </Button>

                <EnquiryModal />
              </div>
            </SheetContent>
          </Sheet>

          {showMobileSearch && (
            <div className="fixed inset-x-0 top-0 z-50 bg-white border-b shadow-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Input
                  autoFocus
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) {
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                      setShowMobileSearch(false);
                    }
                  }}
                  className="border-none focus-visible:ring-0 shadow-none text-xs h-10 font-inter flex-1"
                />

                <Button
                  size="icon"
                  onClick={() => {
                    if (query.trim()) {
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                      setShowMobileSearch(false);
                    }
                  }}
                  className="bg-orange-500 cursor-pointer hover:bg-orange-600 rounded-none h-10 w-10"
                >
                  <IconSearch size={18} />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowMobileSearch(false)}
                  className="bg-transparent text-gray-500 hover:bg-gray-100 rounded-none h-10 w-10"
                >
                  <IconX size={18} />
                </Button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <p className="p-3 text-sm">Searching...</p>
                ) : results.length > 0 ? (
                  results.map((item) => (
                    <div
                      onClick={() => {
                        router.push(`/product/${item.slug}`);
                        setShowMobileSearch(false);
                        setQuery("");
                      }}
                      key={item.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                        <p className="text-xs text-gray-500">
                          {item.productCode}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-3 text-sm text-gray-500">No results found</p>
                )}
              </div>

              <div className="border-t mt-2 pt-2">
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setShowMobileSearch(false);
                  }}
                  className="w-full text-center text-xs text-orange-500 font-medium hover:text-orange-600 py-2"
                >
                  View all products
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
