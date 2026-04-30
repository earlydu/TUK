"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  IconUser,
  IconBuilding,
  IconMail,
  IconPhone,
  IconCategory,
  IconSend,
} from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { log } from "node:console";

export default function Page() {
  const [checked, setChecked] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    productId: "",
    business: "",
    requirement: "",
  });

  // 🔥 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        setProducts(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // 1. Basic Required Fields Check
    if (!form.name || !form.email || !form.requirement || !form.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    // 2. Email Validation with relevant message
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid business email address");
      return;
    }

    // 3. Phone Validation: allow phone numbers with any digit length
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(form.phone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // 4. Privacy Policy Check
    if (!checked) {
      toast.error("Please accept privacy policy");
      return;
    }

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Quote request sent 🚀");
        setForm({
          name: "",
          company: "",
          email: "",
          phone: "",
          productId: "",
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
          className="w-full h-72  text-white flex flex-col items-center justify-center gap-4 px-4
          text-center"
          style={{
            background: "linear-gradient(to right, #141D3D, #364FA3)",
          }}
        >
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
          {/* breadcrumb */}
          <p className="text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-black">
              Home
            </Link>{" "}
            / Request a Quote
          </p>

          {/* title */}

          {/* form */}
          <div className="bg-background border rounded-xl p-6 lg:p-10">
            {/* Contact Info */}
            <div className="mb-10">
              <h3 className="text-sm text-[#1E3A8A] font-semibold  mb-6">
                CONTACT INFORMATION
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Full Name */}
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

                {/* Company Name */}
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

                {/* Business Email */}
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

                {/* Phone Number */}
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

            {/* Requirement Details */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[#1E3A8A] mb-6">
                REQUIREMENTS DETAILS
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* product interest */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Products Interest
                  </label>

                  <div className="relative">
                    <IconCategory className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />

                    <Select
                      value={form.productId}
                      onValueChange={(value) =>
                        setForm({ ...form, productId: value as string })
                      }
                    >
                      <SelectTrigger className="pl-10 w-full">
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>

                      <SelectContent>
                        {products.length > 0 ? (
                          products.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={String(product.name)}
                            >
                              {product.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* company */}
              </div>
              {/* textarea */}
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

            {/* privacy + button */}
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
