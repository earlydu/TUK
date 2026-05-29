import { db } from "@/src/db";
import { products, categories, productCategories } from "@/src/db/schema";
import { NextResponse } from "next/server";
import { ilike, or, sql, and, eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const results = await db
      .selectDistinct({
        id: products.id,
        name: products.name,
        image: products.bannerImageUrl,
        category: categories.name,
        slug: products.slug,
        productCode: products.productCode,
        description: products.description,
        isActive: products.isActive,
      })
      .from(products)
      .leftJoin(productCategories, eq(productCategories.productId, products.id))
      .leftJoin(categories, eq(productCategories.categoryId, categories.id))
      .where(
        and(
          eq(products.isActive, true),
          or(
            ilike(products.name, `%${query}%`),
            ilike(categories.name, `%${query}%`),
            ilike(products.productCode, `%${query}%`),
            ilike(products.description, `%${query}%`)
          )
        )
      )
      .limit(10);

    return NextResponse.json(results);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}