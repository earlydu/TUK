"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  IconSearch,
  IconHome,
  IconBox,
  IconHeadset,
} from "@tabler/icons-react";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
};

const Page = () => {
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
    <>
      <Header />

      <section className="w-full min-h-screen py-10 bg-muted flex items-center justify-center px-4 sm:px-6 xl:px-8">
        <div className="w-full max-w-xl text-center space-y-8">
          {/* 404 IMAGE */}
          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-md aspect-video overflow-hidden rounded-xl">
              <Image
                src="/image/404.png"
                alt="404"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* TITLE */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Page Not Found</h1>

            <p className="text-muted-foreground max-w-lg mx-auto">
              We couldn't find the resource you're looking for. It might have
              been moved, renamed, or is currently undergoing maintenance.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="w-full  justify-center">
            <div className="w-full max-w-lg bg-background border shadow-sm rounded-full flex items-center overflow-hidden py-1 pr-2">
              {/* ICON */}
              <div className="px-4 text-muted-foreground">
                <IconSearch className="size-5" />
              </div>

              {/* INPUT */}
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for tools, parts, or manuals..."
                className="border-none shadow-none focus-visible:ring-0 flex-1 h-10 text-sm"
              />

              {/* BUTTON */}
              <Button className="rounded-full cursor-pointer px-5 h-10 bg-[#0300A7]  text-white">
                Search
              </Button>
            </div>
            {/* Dropdown */}
            {query && (
              <div className="  bg-white border ml-4 w-10/12 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {loading ? (
                  <p className="p-3 text-sm">Searching...</p>
                ) : results.length > 0 ? (
                  results.map((item) => (
                    <div
                      onClick={() => {
                        (window as any).showGlobalLoader?.();
                        router.push(`/product/${item.slug}`);
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
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-3 text-sm text-gray-500">No results found</p>
                )}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3  w-full">
            <Link href="/" className="w-full">
              <Button
                variant="outline"
                className="w-full cursor-pointer flex items-center gap-2 justify-center h-12"
              >
                <IconHome className="size-4 text-[#0300A7]" />
                Home Page
              </Button>
            </Link>

            <Link href="/product" className="w-full">
              <Button
                variant="outline"
                className="w-full cursor-pointer flex items-center gap-2 justify-center h-12"
              >
                <IconBox className="size-4 text-[#0300A7]" />
                Products
              </Button>
            </Link>

            <Link href="/contact" className="w-full">
              <Button
                variant="outline"
                className="w-full cursor-pointer flex items-center gap-2 justify-center h-12"
              >
                <IconHeadset className="size-4 text-[#0300A7]" />
                Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Page;
