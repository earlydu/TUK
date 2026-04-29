"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { IconMenu2, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import EnquiryModal from "./EnquiryModal";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/category" },
  { name: "About", href: "/about" },
  { name: "Wishlist", href: "/wishlist" },
  { name: "Distributor", href: "/distributor" },
  { name: "Contact", href: "/contact" },
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
    <header className="w-full border-b bg-white font-barlow ">
      <div className="container mx-auto flex items-center justify-between py-2 px-4 lg:px-6 xl:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
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
              className="border-none focus-visible:ring-0 shadow-none"
            />

            <Button
              size="icon"
              className="bg-orange-500 cursor-pointer hover:bg-orange-600 rounded-none"
            >
              <IconSearch size={18} />
            </Button>
          </div>

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
            </div>
          )}

          {/* <Button className="rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A] text-xs px-6 h-8">
        Enquiries
    </Button> */}
          <EnquiryModal />
        </div>

        {/* Mobile */}
        <div className="lg:hidden font-poppins">
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

                <div className="flex items-center border rounded-full overflow-hidden h-8">
                  <Input
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-none focus-visible:ring-0 shadow-none text-xs h-8 font-inter"
                  />

                  <Button
                    size="icon"
                    className="bg-orange-500 cursor-pointer hover:bg-orange-600 rounded-none h-8 w-8"
                  >
                    <IconSearch size={16} />
                  </Button>
                </div>
                {query && (
                  <div className="absolute top-72 w-52 bg-white border mt-2 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
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
                            <p className="text-xs text-gray-500">
                              {item.category}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.productCode}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="p-3 text-sm text-gray-500">
                        No results found
                      </p>
                    )}
                  </div>
                )}

                <EnquiryModal />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
