import { db } from "@/src/db";
import {
  products,
  productFeatures,
  productSpecifications,
  productImages,
  productDiTerms,
  relatedProducts as relatedProductsTable,
} from "@/src/db/schema";
import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { distributors, productDistributor } from "@/src/db/schema";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX
) {
  try {
    const { id } = await params; // ✅ VERY IMPORTANT

    if (!id) {
      return NextResponse.json(
        { error: "ID is missing" },
        { status: 400 }
      );
    }

    // 🔥 MAIN PRODUCT
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .then((res) => res[0]);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // 🔥 RELATED DATA
    const features = await db
      .select()
      .from(productFeatures)
      .where(eq(productFeatures.productId, id));

    const specifications = await db
      .select()
      .from(productSpecifications)
      .where(eq(productSpecifications.productId, id));

    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, id));

    const diTerms = await db
      .select()
      .from(productDiTerms)
      .where(eq(productDiTerms.productId, id));

      const distributorsData = await db
      .select({
        distributor: distributors,
      })
      .from(productDistributor)
      .leftJoin(
        distributors,
        eq(productDistributor.distributorsId, distributors.id),
      )
      .where(eq(productDistributor.productId, id));

    const distributorsList = distributorsData
      .map((item) => item.distributor)
      .filter(Boolean);

    const relatedProducts = await db
      .select({ relatedProductId: relatedProductsTable.relatedProductId })
      .from(relatedProductsTable)
      .where(eq(relatedProductsTable.productId, id));

    const relatedProductIds = relatedProducts.map(
      (item) => item.relatedProductId,
    );

    const relatedCategoriesQuery = await db
      .select({ categoryId: products.categoryId })
      .from(relatedProductsTable)
      .leftJoin(products, eq(relatedProductsTable.relatedProductId, products.id))
      .where(eq(relatedProductsTable.productId, id));

    const relatedCategoryIds = Array.from(
      new Set(
        relatedCategoriesQuery
          .map((item) => item.categoryId)
          .filter(Boolean),
      ),
    );

    return NextResponse.json({
      ...product,
      features,
      specifications,
      images,
      diTerms,
      distributors: distributorsList,
      relatedProducts: relatedProductIds,
      relatedCategories: relatedCategoryIds,
    });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// ✅ PUT (for update button)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX
) {
  try {
    const { id } = await params; // ✅ MUST

    if (!id) {
      return Response.json({ error: "Missing ID" }, { status: 400 });
    }

    const body = await req.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.shortDescription !== undefined)
      updateData.shortDescription = body.shortDescription;
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.sku !== undefined) updateData.sku = body.sku;
    if (body.productCode !== undefined)
      updateData.productCode = body.productCode;
    if (body.categoryId !== undefined)
      updateData.categoryId = body.categoryId;
    if (body.bannerImageUrl !== undefined)
      updateData.bannerImageUrl = body.bannerImageUrl;
    if (body.pdfUrl !== undefined) updateData.pdfUrl = body.pdfUrl;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isNew !== undefined) updateData.isNew = body.isNew;

    if (Object.keys(updateData).length > 0) {
      await db.update(products).set(updateData).where(eq(products.id, id));
    }

    if (body.features !== undefined) {
      await db.delete(productFeatures).where(eq(productFeatures.productId, id));
      if (body.features?.length > 0) {
        await db.insert(productFeatures).values(
          body.features.map((feature: string) => ({
            productId: id,
            feature,
          }))
        );
      }
    }

    if (body.specs !== undefined || body.techspecs !== undefined) {
      await db
        .delete(productSpecifications)
        .where(eq(productSpecifications.productId, id));

      const allSpecs = [
        ...(body.specs?.filter((s: any) => s?.key && s?.value) || []),
        ...(body.techspecs?.filter((s: any) => s?.key && s?.value) || []),
      ];

      if (allSpecs.length > 0) {
        const uniqueSpecs = Array.from(
          new Map(
            allSpecs.map((spec: any) => [`${spec.key}-${spec.value}`, spec])
          ).values()
        );

        await db.insert(productSpecifications).values(
          uniqueSpecs.map((spec: any) => ({
            productId: id,
            key: spec.key,
            value: spec.value,
          }))
        );
      }
    }

    if (body.images !== undefined) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      if (body.images?.length > 0) {
        await db.insert(productImages).values(
          body.images.map((imageUrl: string) => ({
            productId: id,
            imageUrl,
          }))
        );
      }
    }

    if (body.diTerms !== undefined) {
      await db.delete(productDiTerms).where(eq(productDiTerms.productId, id));
      if (body.diTerms?.length > 0) {
        await db.insert(productDiTerms).values(
          body.diTerms.map((term: string) => ({
            productId: id,
            value: term,
          }))
        );
      }
    }

    if (body.distributors !== undefined) {
      await db.delete(productDistributor).where(eq(productDistributor.productId, id));
      if (body.distributors?.length > 0) {
        await db.insert(productDistributor).values(
          body.distributors.map((distId: string) => ({
            productId: id,
            distributorsId: distId,
          })),
        );
      }
    }

    if (body.relatedCategories !== undefined) {
      await db
        .delete(relatedProductsTable)
        .where(eq(relatedProductsTable.productId, id));

      if (body.relatedCategories?.length > 0) {
        const relatedRows: { productId: string; relatedProductId: string }[] = [];

        for (const categoryId of body.relatedCategories) {
          const categoryProducts = await db
            .select({ id: products.id })
            .from(products)
            .where(eq(products.categoryId, categoryId));

          const validProduct = categoryProducts.find(
            (productRow) => productRow.id !== id,
          );

          if (validProduct) {
            relatedRows.push({
              productId: id,
              relatedProductId: validProduct.id,
            });
          }
        }

        if (relatedRows.length > 0) {
          const uniqueRows = Array.from(
            new Map(
              relatedRows.map((row) => [row.relatedProductId, row]),
            ).values(),
          );

          await db.insert(relatedProductsTable).values(uniqueRows);
        }
      }
    } else if (body.relatedProducts !== undefined) {
      await db
        .delete(relatedProductsTable)
        .where(eq(relatedProductsTable.productId, id));

      if (body.relatedProducts?.length > 0) {
        await db.insert(relatedProductsTable).values(
          body.relatedProducts.map((relatedProductId: string) => ({
            productId: id,
            relatedProductId,
          })),
        );
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return Response.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID is missing" },
        { status: 400 }
      );
    }

    // 🔥 Delete all related data first
    await db.delete(productFeatures).where(eq(productFeatures.productId, id));
    await db.delete(productSpecifications).where(eq(productSpecifications.productId, id));
    await db.delete(productImages).where(eq(productImages.productId, id));
    await db.delete(productDiTerms).where(eq(productDiTerms.productId, id));
    await db.delete(productDistributor).where(eq(productDistributor.productId, id));
    await db
      .delete(relatedProductsTable)
      .where(
        or(
          eq(relatedProductsTable.productId, id),
          eq(relatedProductsTable.relatedProductId, id),
        ),
      );

    // 🔥 Delete main product
    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}