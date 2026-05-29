import type { Metadata } from "next";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

import ProductGallery from "@/components/common/product/product-gallery";
import ProductInfo from "@/components/common/product/product-info";
import TechnicalDataSheet from "@/components/common/product/TechnicalDataSheet";
import ProductDetailsTabs from "@/components/common/product/ProductDetailsTabs";
import RelatedProducts from "@/components/common/Related Products";

import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    const product = await response.json();

    const title = product.name;
    const description =
      product.shortDescription ||
      product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
      `${product.name} — high-quality voice and data cabling product by TUK Ltd.`;
    const image =
      product.bannerImageUrl ||
      product.images?.[0]?.imageUrl ||
      "/og-image.png";

    return {
      title,
      description,
      openGraph: {
        title: `${product.name} — TUK Ltd`,
        description,
        images: [{ url: image, alt: product.name }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} — TUK Ltd`,
        description,
        images: [image],
      },
      alternates: {
        canonical: `https://tuk.co.uk/product/${slug}`,
      },
    };
  } catch {
    return {
      title: "Product",
      description: "TUK Ltd cabling product.",
    };
  }
}


export default async function Page({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product data
  let product = null;
  let error = false;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      error = true;
    } else {
      product = await response.json();
    }
  } catch (err) {
    error = true;
  }

  // Show 404 if product not found
  if (error || !product) {
    notFound();
  }
  console.log(product);

  return (
    <>
      <Header />
      <div
        className="relative w-full  h-56 font-poppins"
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
        <h1 className="text-3xl font-semibold text-white text-center flex items-center justify-center h-full">
          {product.name}
        </h1>
  
      </div>
      {/* ✅ Breadcrumb Start */}
      <div className="w-full bg-gray-50 font-poppins ">
        <div className="container mx-auto px-4 py-4 text-sm text-muted-foreground flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-foreground transition">
            Home
          </Link>

          <span>›</span>

          <Link href="/product" className="hover:text-foreground transition">
            Product
          </Link>

          <span>›</span>

          <Link href="/category" className="hover:text-foreground transition">
            Category
          </Link>

          <span>›</span>

          <span className="text-foreground font-medium">
            {product.name || "Product"}
          </span>
        </div>
      </div>
      {/* ✅ Breadcrumb End */}

      <section className="w-full bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Top Product Section */}
          <div className="grid lg:grid-cols-2 gap-10">
            <ProductGallery
              bannerImageUrl={product.bannerImageUrl}
              images={product.images || []}
            />
            
            <ProductInfo product={product} />
          </div>

          {/* Technical Data Sheet Section */}
          <div className="mt-10">
            

            <ProductDetailsTabs product={product} />
            <RelatedProducts
              productId={product.id}
              currentProductId={product.id}
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
