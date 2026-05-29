import { db } from "@/src/db";
import { products, categories, productCategories } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const includeInactive = url.searchParams.get("includeInactive") === "true";

  // Get all products
  const baseQuery = db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      bannerImageUrl: products.bannerImageUrl,
      shortDescription: products.shortDescription,
      brand: products.brand,
      sku: products.sku,
      productCode: products.productCode,
      pdfUrl: products.pdfUrl,
      isFeatured: products.isFeatured,
      isActive: products.isActive,
      createdAt: products.createdAt,
      categoryId: products.categoryId,
    })
    .from(products);

  const productRows = includeInactive
    ? await baseQuery
    : await baseQuery.where(eq(products.isActive, true));

  // Get all category mappings in one query
  const allCatMappings = await db
    .select({
      productId: productCategories.productId,
      categoryName: categories.name,
    })
    .from(productCategories)
    .innerJoin(categories, eq(productCategories.categoryId, categories.id));

  // Build a map: productId -> category names
  const catMap = new Map<string, string[]>();
  for (const row of allCatMappings) {
    if (!catMap.has(row.productId)) catMap.set(row.productId, []);
    if (row.categoryName) catMap.get(row.productId)!.push(row.categoryName);
  }

  // Merge
  const data = productRows.map((p) => ({
    ...p,
    category: catMap.get(p.id)?.join(", ") || null,
  }));

  return Response.json(data);
}