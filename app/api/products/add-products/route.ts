import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import {
  products,
  productImages,
  productFeatures,
  productSpecifications,
  productDiTerms,
  productCategories,
  relatedProducts as relatedProductsTable,
} from "@/src/db/schema";
import { productDistributor } from "@/src/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      slug,
      description,
      shortDescription,
      brand,
      sku,
      productCode,
      categoryIds = [],
      // backward compat: accept old single categoryId too
      categoryId,
      features = [],
      specs = [],
      techspecs = [],
      diTerms = [],
      bannerImageUrl = "",
      images = [],
      content,
      isFeatured = false,
      isNew = false,
      pdfUrl,
      relatedProducts = [],
      relatedCategories = [],
    } = body;

    // Build final category IDs array (support both old and new format)
    const finalCategoryIds: string[] =
      categoryIds.length > 0
        ? categoryIds
        : categoryId
          ? [categoryId]
          : [];

    // ✅ Validation
    if (!name || !slug || finalCategoryIds.length === 0) {
      return Response.json(
        { error: "Name, slug and at least one category are required" },
        { status: 400 }
      );
    }

    const result = await db.transaction(async (tx) => {
      // 🔥 1. Insert Product (use first category as primary for backward compat)
      const [product] = await tx
        .insert(products)
        .values({
          name,
          slug,
          description,
          shortDescription,
          brand,
          bannerImageUrl,
          sku,
          productCode,
          categoryId: finalCategoryIds[0],
          content,
          pdfUrl,
          isFeatured: Boolean(isFeatured),
          isNew: Boolean(isNew),
        })
        .returning();

      const productId = product.id;

      // 🔥 2. Insert product_categories junction rows
      await tx.insert(productCategories).values(
        finalCategoryIds.map((catId: string) => ({
          productId,
          categoryId: catId,
        }))
      );

      if (body.distributors?.length > 0) {
        await tx.insert(productDistributor).values(
          body.distributors.map((distId: string) => ({
            productId,
            distributorsId: distId,
          }))
        );
      }

      // 🔥 3. Insert Gallery Images (MULTIPLE)
      if (images.length > 0) {
        await tx.insert(productImages).values(
          images.map((img: string, i: number) => ({
            productId,
            imageUrl: img,
            isPrimary: i === 0,
          }))
        );
      }

      // 🔥 4. ALSO insert banner into images
      if (bannerImageUrl) {
        await tx.insert(productImages).values({
          productId,
          imageUrl: bannerImageUrl,
          isPrimary: true,
        });
      }

      // ⭐ Features
      const cleanFeatures = features.filter((f: string) => f?.trim());
      if (cleanFeatures.length > 0) {
        await tx.insert(productFeatures).values(
          cleanFeatures.map((f: string) => ({
            productId,
            feature: f,
          }))
        );
      }

      // 📊 Specs
      const allSpecs = [...specs, ...techspecs].filter(
        (s: any) => s?.key && s?.value
      );

      if (allSpecs.length > 0) {
        await tx.insert(productSpecifications).values(
          allSpecs.map((s: any) => ({
            productId,
            key: s.key,
            value: s.value,
          }))
        );
      }

      // 🏷️ DI Terms
      const cleanTerms = diTerms.filter((t: string) => t?.trim());
      if (cleanTerms.length > 0) {
        await tx.insert(productDiTerms).values(
          cleanTerms.map((term: string) => ({
            productId,
            value: term,
          }))
        );
      }

      // 🔗 Related Categories or Related Products
      const relatedProductsList: string[] = body.relatedProducts || [];
      const relatedCategoriesList: string[] = body.relatedCategories || [];
      const relatedRows: { productId: string; relatedProductId: string }[] = [];

      if (relatedCategoriesList.length > 0) {
        for (const catId of relatedCategoriesList) {
          const categoryProducts = await tx
            .select({ id: products.id })
            .from(products)
            .innerJoin(productCategories, eq(productCategories.productId, products.id))
            .where(eq(productCategories.categoryId, catId));

          categoryProducts
            .filter((productRow) => productRow.id !== productId)
            .slice(0, 6)
            .forEach((productRow) => {
              relatedRows.push({
                productId,
                relatedProductId: productRow.id,
              });
            });
        }
      } else if (relatedProductsList.length > 0) {
        relatedRows.push(
          ...relatedProductsList.map((relatedProductId: string) => ({
            productId,
            relatedProductId,
          })),
        );
      }

      if (relatedRows.length > 0) {
        const uniqueRows = Array.from(
          new Map(
            relatedRows.map((row) => [row.relatedProductId, row]),
          ).values(),
        );

        await tx.insert(relatedProductsTable).values(uniqueRows);
      }

      return product;
    });

    return Response.json({
      success: true,
      productId: result.id,
    });

  } catch (error: any) {
    console.error("❌ PRODUCT CREATE ERROR:", error);

    return Response.json(
      {
        error: error?.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}