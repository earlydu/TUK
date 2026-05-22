"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  IconCheck,
  IconCopy,
  IconTruck,
  IconShieldCheck,
  IconMessageCircle,
  IconPhone,
  IconMail,
  IconFileText,
  IconHeart,
  IconRosetteDiscountCheck,
} from "@tabler/icons-react";
import DitermsSelector from "@/app/product/[slug]/DitermsSelector";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
};

interface ProductInfoProps {
  product?: {
    name?: string;
    description?: string;
    shortDescription?: string;
    id?: string;
    slug?: string;
    productCode?: string;
    sku?: string;
    brand?: string;
    features?: Array<{ feature: string }>;
    specifications?: Array<{ key: string; value: string }>;
    diTerms?: Array<{ value: string }>;
    distributors?: {
      id: string;
      name: string;
    }[];
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [qty, setQty] = useState(1);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const isWishlisted = wishlistIds.includes(product?.id as string);

  // Fallback data
  const productName = product?.name;
  const productCode = product?.productCode || "PXSPDY6BL";
  const sku = product?.sku || "PXSPDY6B / PXSPDY6BL";
  const description =
    product?.description ||
    "High-performance 23AWG solid copper conductor Cat6 UTP cable for reliable data transmission up to 250MHz. Suitable for Gigabit Ethernet installations. This premium quality cable meets all TIA/EIA standards and is ideal for commercial and industrial network installations.";
  const features = product?.features || [];
  const specs = product?.specifications || [];

  const diTerms =
    product?.diTerms?.map((term: any) => term.value).join("|") || "";

  useEffect(() => {
    const items = getWishlist();
    setWishlistIds(items.map((i: any) => i.id));
  }, []);

  useEffect(() => {
    // Hide global loader when product info mounts
    try {
      (window as any).hideGlobalLoader?.();
    } catch (e) {
      // noop
    }
  }, []);
  const handleWishlist = (product: any) => {
    let wishlist = getWishlist();

    const exists = wishlist.find((i: any) => i.id === product.id);

    if (exists) {
      wishlist = wishlist.filter((i: any) => i.id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setWishlistIds(wishlist.map((i: any) => i.id));

      toast("Removed from wishlist ❌");
    } else {
      wishlist.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        bannerImageUrl: product.bannerImageUrl,
        sku: product.sku,
      });

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setWishlistIds(wishlist.map((i: any) => i.id));

      toast.success("Added to wishlist ❤️");
    }
  };

  console.log(product?.distributors);
  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <span className="text-primary font-medium font-poppins">
          {product?.brand || "Network Cables"}
        </span>
        {/* <span>|</span>
        <span>SKU: {sku}</span> */}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold font-poppins">{productName}</h1>

      {/* Product Code */}
      <div className="flex items-center gap-3">
        <div className="border rounded-lg px-3 py-2 flex items-center gap-2 bg-muted/40">
          <span className="text-sm text-muted-foreground font-poppins">
            Product Code(s):
          </span>

          <span className="font-medium font-poppins">{productCode}</span>

          {/* <IconCopy
            size={18}
            className="cursor-pointer text-muted-foreground"
          /> */}
        </div>
      </div>

      {/* Badges */}
      {/* <div className="flex gap-3 flex-wrap">
        <Badge className="bg-orange-100 text-orange-600 border-0">
          🔥 Popular
        </Badge>

        <Badge className="bg-green-100 text-green-600 border-0">
          ✔ In Stock
        </Badge>

        <Badge className="bg-blue-100 text-[#1E3A8A] border-0">
          B2B Pricing
        </Badge>
      </div> */}

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed font-poppins">
        {description}
      </p>

      {/* Key Features */}
      {features.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-lg font-inter">Key Features</h3>

          <ul className="flex flex-col gap-2 font-poppins">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <IconCheck className="text-green-600 mt-1 shrink-0" size={18} />
                {feature.feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Specifications */}
      {specs.length > 0 && (
        <div className="bg-muted/40 rounded-xl border p-4">
          <h4 className="font-semibold mb-3 font-inter">
            Quick Specifications
          </h4>

          <div className="grid grid-cols-2 gap-3 text-sm font-poppins">
            {specs.slice(0, 4).map((spec, idx) => (
              <div key={idx}>
                <p className="text-muted-foreground">{spec.key}</p>
                <p className="font-medium">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-row flex-wrap gap-4 w-full font-poppins">
        {/* Request Quote */}
        <Link
          href={`/request-quote?productId=${product?.id || ""}`}
          className="flex-1"
        >
          <Button className="w-full h-14 sm:h-12 rounded-full cursor-pointer bg-[#0b0bbf] hover:bg-[#0b0bbf] text-white text-base sm:text-sm font-medium flex items-center justify-center gap-2 px-6">
            <IconFileText size={20} />
            Request Quote
          </Button>
        </Link>

        {/* Wishlist */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleWishlist(product);
          }}
          variant="outline"
          className="flex-1 w-full h-14 sm:h-12 rounded-full font-poppins cursor-pointer border-[#0b0bbf] text-[#0b0bbf] hover:bg-transparent text-base sm:text-sm font-medium flex items-center justify-center gap-2 px-6"
        >
          <IconHeart
            size={20}
            className={`transition-all ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-[#0b0bbf]"
            }`}
          />
          {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
        </Button>
      </div>
      <DitermsSelector diTerms={diTerms} />
      {/* B2B Pricing Box */}
      <div className="flex items-start gap-4 bg-gray-100 border rounded-xl p-4 font-poppins">
        {/* Icon Box */}
        <div className="bg-[#0300A7] text-white p-3 rounded-lg flex items-center justify-center">
          <IconMessageCircle size={22} />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-base">Need B2B Pricing?</p>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Our sales team specializes in bulk orders and can provide
            competitive pricing for wholesalers and distributors.
          </p>

          {/* Contact Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#0300A7] font-extrabold">
            <span className="flex items-center gap-2 cursor-pointer">
              <IconPhone size={16} />
              <a href="tel:+442089469494">+44 (0)20 8946 9494</a>
            </span>

            <span className="flex items-center gap-2 cursor-pointer">
              <IconMail size={16} />
              <a href="mailto:sales@tuk.co.uk">sales@tuk.co.uk</a>
            </span>
          </div>
        </div>
      </div>

      {product?.distributors && product.distributors.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mt-4 font-poppins">
            {" "}
            Distributors
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {product.distributors.map((d: any) => (
              <div
                key={d.id}
                className="border rounded-lg p-3 flex flex-col items-center"
              >
                <Image
                  src={d.image}
                  alt={d.name}
                  width={100}
                  height={200}
                  className="w-24 h-14 object-contain mb-2"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer Info */}
      {/* <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 font-poppins">
        <span className="flex items-center gap-2">
          <IconShieldCheck size={18} className="text-green-600" />
          ISO 9001 Certified
        </span>

        <span className="flex items-center gap-2">
          <IconTruck size={18} className="text-blue-600" />
          Fast UK Delivery
        </span>

        <span className="flex items-center gap-2">
          <IconRosetteDiscountCheck size={18} className="text-orange-500" />2
          Year Warranty
        </span>
      </div> */}
    </div>
  );
}
