import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import {
  products,
  productImages,
  productFeatures,
  productSpecifications,
  productDiTerms,
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
      categoryId,
      features = [],
      specs = [],
      techspecs = [],
      diTerms = [],
      bannerImageUrl = "",
      images = [], // ✅ ADD THIS (gallery images)
      content,
      isFeatured = false,
      isNew = false,
      pdfUrl,
      relatedProducts = [],
    } = body;

    // ✅ Validation
    if (!name || !slug || !categoryId) {
      return Response.json(
        { error: "Name, slug and category are required" },
        { status: 400 }
      );
    }

    const result = await db.transaction(async (tx) => {
      // 🔥 1. Insert Product
      const [product] = await tx
        .insert(products)
        .values({
          name,
          slug,
          description,
          shortDescription,
          brand,
          bannerImageUrl, // ✅ banner stored here
          sku,
          productCode,
          categoryId,
          content,
          pdfUrl,
          isFeatured: Boolean(isFeatured),
          isNew: Boolean(isNew),
        })
        .returning();

      const productId = product.id;

      if (body.distributors?.length > 0) {
  await tx.insert(productDistributor).values(
    body.distributors.map((distId: string) => ({
      productId,
      distributorsId: distId,
    }))
  );
}

      // 🔥 2. Insert Gallery Images (MULTIPLE)
      if (images.length > 0) {
        await tx.insert(productImages).values(
          images.map((img: string, i: number) => ({
            productId,
            imageUrl: img,
            isPrimary: i === 0, // first = primary
          }))
        );
      }

      // 🔥 3. ALSO insert banner into images (optional but recommended)
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

      // 🔗 Related Categories -> save valid related product IDs
      const relatedCategories: string[] = body.relatedCategories || [];
      const relatedProducts: string[] = body.relatedProducts || [];

      const relatedRows: { productId: string; relatedProductId: string }[] = [];

      if (relatedProducts.length > 0) {
        relatedRows.push(
          ...relatedProducts.map((relatedProductId: string) => ({
            productId,
            relatedProductId,
          })),
        );
      }

      if (relatedCategories.length > 0) {
        for (const categoryId of relatedCategories) {
          const categoryProducts = await tx
            .select({ id: products.id })
            .from(products)
            .where(eq(products.categoryId, categoryId));

          const validProduct = categoryProducts.find(
            (productRow) => productRow.id !== productId,
          );

          if (validProduct) {
            relatedRows.push({
              productId,
              relatedProductId: validProduct.id,
            });
          }
        }
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