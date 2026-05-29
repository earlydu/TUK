import { db } from "@/src/db";
import { products, categories, productCategories } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    // 🔹 Get categories
    const category = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.id))
      .limit(10);

    // 🔹 Attach products to each category via junction table
    const categoriesWithProducts = await Promise.all(
      category.map(async (cat) => {
        const relatedProducts = await db
          .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            description: products.description,
            bannerImageUrl: products.bannerImageUrl,
            shortDescription: products.shortDescription,
            categoryId: products.categoryId,
            brand: products.brand,
            sku: products.sku,
            productCode: products.productCode,
            pdfUrl: products.pdfUrl,
            content: products.content,
            isFeatured: products.isFeatured,
            isNew: products.isNew,
            isActive: products.isActive,
            createdAt: products.createdAt,
          })
          .from(productCategories)
          .innerJoin(products, eq(productCategories.productId, products.id))
          .where(eq(productCategories.categoryId, cat.id))
          .limit(1);

        return {
          ...cat,
          products: relatedProducts,
        };
      })
    );

    return Response.json({
      recentCategories: categoriesWithProducts,
    });
  } catch (error) {
    return Response.json({ error: "Error fetching data" }, { status: 500 });
  }
}