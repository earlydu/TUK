"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  IconUser,
  IconBuilding,
  IconMail,
  IconPhone,
  IconCategory,
  IconSend,
  IconChevronDown,
} from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function RequestQuoteForm() {
  const [checked, setChecked] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const searchParams = useSearchParams();
  const selectedProductId = searchParams.get("productId");

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    productIds: [] as string[],
    business: "",
    requirement: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        const sortedProducts =
          data?.sort((a: any, b: any) => a.name.localeCompare(b.name)) || [];

        setProducts(sortedProducts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!selectedProductId || products.length === 0) {
      return;
    }

    setForm((prev) => {
      if (prev.productIds.includes(selectedProductId)) {
        return prev;
      }

      return {
        ...prev,
        productIds: [selectedProductId, ...prev.productIds],
      };
    });
  }, [products, selectedProductId]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.requirement || !form.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid business email address");
      return;
    }

    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(form.phone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!checked) {
      toast.error("Please accept privacy policy");
      return;
    }

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          productIds: form.productIds,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Quote request sent 🚀");
        setForm({
          name: "",
          company: "",
          email: "",
          phone: "",
          productIds: [],
          business: "",
          requirement: "",
        });
        setChecked(false);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Header />

      <section className="w-full font-poppins bg-muted/40">
        <div
          className="relative w-full h-72 text-white flex flex-col items-center justify-center gap-4 px-4 text-center"
          style={{
            background: "linear-gradient(to right, #141D3D, #364FA3)",
          }}
        >
          <Image
            alt="Hero Background"
            src="/graph1.jpeg"
            className="absolute top-0 left-0 w-full h-full z-10 opacity-20 "
            width={1920}
            height={100}

          />
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-semibold font-poppins">
            Request a Quote
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80 max-w-2xl mx-auto font-poppins">
            TUK ltd provides high-quality, professional-grade cabling solutions
            for global trade buyers and distributors. Fill our the form below to
            recieve a custom quotation tailored to your business requirements.
          </p>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-10 lg:py-16">
          <p className="text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-black">
              Home
            </Link>{" "}
            / Request a Quote
          </p>

          <div className="bg-background border rounded-xl p-6 lg:p-10">
            <div className="mb-10">
              <h3 className="text-sm text-[#1E3A8A] font-semibold mb-6">
                CONTACT INFORMATION
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <div className="relative">
                    <IconBuilding className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Company Name"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Email</label>
                  <div className="relative">
                    <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Business Email"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[#1E3A8A] mb-6">
                REQUIREMENTS DETAILS
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Products of Interest
                  </label>

                  <div className="relative">
                    <IconCategory className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />

                    <div className="relative product-dropdown">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setIsProductDropdownOpen(!isProductDropdownOpen)
                        }
                        className="w-full justify-between pl-10 pr-3"
                      >
                        {form.productIds.length > 0
                          ? `${form.productIds.length} product(s) selected`
                          : "Select products..."}
                        <IconChevronDown className="h-4 w-4 opacity-50" />
                      </Button>

                      {isProductDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-hidden">
                          <div className="p-2 border-b">
                            <Input
                              placeholder="Search products..."
                              value={productSearch}
                              onChange={(e) => setProductSearch(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {products
                              .filter((product) =>
                                product.name
                                  .toLowerCase()
                                  .includes(productSearch.toLowerCase()),
                              )
                              .map((product) => (
                                <div
                                  key={product.id}
                                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                                  onClick={() => {
                                    const isSelected = form.productIds.includes(
                                      product.id,
                                    );
                                    setForm({
                                      ...form,
                                      productIds: isSelected
                                        ? form.productIds.filter(
                                          (id) => id !== product.id,
                                        )
                                        : [...form.productIds, product.id],
                                    });
                                  }}
                                >
                                  <Checkbox
                                    checked={form.productIds.includes(
                                      product.id,
                                    )}
                                    className="pointer-events-none"
                                  />
                                  <Image
                                    src={
                                      product.bannerImageUrl ||
                                      "/image/no-image.png"
                                    }
                                    alt={product.name}
                                    width={32}
                                    height={32}
                                    className="rounded object-cover"
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">
                                      {product.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {product.productCode || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            {products.filter((product) =>
                              product.name
                                .toLowerCase()
                                .includes(productSearch.toLowerCase()),
                            ).length === 0 && (
                                <div className="p-3 text-sm text-gray-500 text-center">
                                  No products found
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {form.productIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.productIds.map((id) => {
                        const product = products.find((p) => p.id === id);
                        return product ? (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Image
                              src={
                                product.bannerImageUrl || "/image/no-image.png"
                              }
                              alt={product.name}
                              width={16}
                              height={16}
                              className="rounded"
                            />
                            {product.name}
                            <button
                              onClick={() =>
                                setForm({
                                  ...form,
                                  productIds: form.productIds.filter(
                                    (pid) => pid !== id,
                                  ),
                                })
                              }
                              className="ml-1 text-muted-foreground hover:text-foreground"
                            >
                              ×
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="text-sm font-medium">
                  Additional Comments
                </label>

                <Textarea
                  name="requirement"
                  value={form.requirement}
                  onChange={handleChange}
                  placeholder="Please describe any specific technical requirements"
                  className="min-h-30"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <Checkbox checked={checked} onCheckedChange={setChecked} />

                <label
                  htmlFor="policy"
                  className="text-sm text-muted-foreground leading-relaxed"
                >
                  I agree to TUK ltd's{" "}
                  <span className="text-[#F97316] underline cursor-pointer">
                    <Link href="/privacy-policy"> Privacy Policy</Link>
                  </span>{" "}
                  and understand my data will be used to process this enquiry.
                </label>
              </div>

              <Button
                onClick={handleSubmit}
                className="flex items-center cursor-pointer p-6 rounded-full shadow shadow-blue-900 bg-[#135BEC] gap-2"
              >
                Submit Enquiry
                <IconSend size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
