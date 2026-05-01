import { db } from "@/src/db";
import {
  products,
  productImages,
  productFeatures,
  productSpecifications,
  productDiTerms,
  relatedProducts as relatedProductsTable,
} from "@/src/db/schema";
import { and, eq } from "drizzle-orm";
import { distributors, productDistributor } from "@/src/db/schema";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return Response.json({ error: "Slug is required" }, { status: 400 });
    }

    const product = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, slug), eq(products.isActive, true)));

    if (!product.length) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const productData = product[0];

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productData.id));

  const features = await db
    .select()
    .from(productFeatures)
    .where(eq(productFeatures.productId, productData.id));

  const specifications = await db
    .select()
    .from(productSpecifications)
    .where(eq(productSpecifications.productId, productData.id));

  const diTerms = await db
    .select()
    .from(productDiTerms)
    .where(eq(productDiTerms.productId, productData.id));

   const distributorsData = await db
  .select({
    id: distributors.id,
    name: distributors.name,
    image: distributors.image,
  })
  .from(productDistributor)
  .innerJoin(
    distributors,
    eq(productDistributor.distributorsId, distributors.id)
  )
 .where(eq(productDistributor.productId, productData.id));

  const distributorsList = distributorsData;

 

  const relatedProds = await db
    .select()
    .from(relatedProductsTable)
    .where(eq(relatedProductsTable.productId, productData.id));

  return Response.json({
    ...productData,
    images,
    features,
    specifications,
    diTerms,
    relatedProducts: relatedProds,
      distributors: distributorsList, // ✅ ADD THIS
  });
  } catch (error) {
    console.error("[api/products/slug/[slug]] fetch error:", error);
    return Response.json(
      { error: "Database error: " + (error instanceof Error ? error.message : "unknown") },
      { status: 500 }
    );
  }
}


