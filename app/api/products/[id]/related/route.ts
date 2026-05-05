import { db } from "@/src/db";
import { products, relatedProducts as relatedProductsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  ctx: RouteContext<'/api/products/[id]/related'>
) {
  const { id } = await ctx.params;
  const productId = id;

  try {
    const related = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        bannerImageUrl: products.bannerImageUrl,
        description: products.description,
        sku: products.sku,
        productCode: products.productCode,
        categoryId: products.categoryId,
      })
      .from(relatedProductsTable)
      .innerJoin(
        products,
        eq(relatedProductsTable.relatedProductId, products.id),
      )
      .where(eq(relatedProductsTable.productId, productId))
      .limit(8);
    
    // console.log("Related products:", related); // ✅ debug

    return Response.json(related);
  } catch (err: any) {
    console.error("❌ RELATED API ERROR:", err); // 🔥 IMPORTANT

    return Response.json([], { status: 500 }); // always return array
  }
}
