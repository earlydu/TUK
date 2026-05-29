import { db } from "@/src/db";
import {
  products,
  productFeatures,
  productSpecifications,
  productImages,
  productDiTerms,
  productDistributor,
  productCategories,
} from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID is missing" }, { status: 400 });
    }

    // ── 1. Fetch original product ──
    const original = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .then((res) => res[0]);

    if (!original) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ── 2. Fetch all related data ──
    const [features, specifications, images, diTerms, distributorLinks, categoryLinks] =
      await Promise.all([
        db.select().from(productFeatures).where(eq(productFeatures.productId, id)),
        db.select().from(productSpecifications).where(eq(productSpecifications.productId, id)),
        db.select().from(productImages).where(eq(productImages.productId, id)),
        db.select().from(productDiTerms).where(eq(productDiTerms.productId, id)),
        db.select().from(productDistributor).where(eq(productDistributor.productId, id)),
        db.select().from(productCategories).where(eq(productCategories.productId, id)),
      ]);

    // ── 3. Build a unique slug ──
    const timestamp = Date.now();
    const newSlug = `${original.slug}-copy-${timestamp}`;
    const newName = `Copy of ${original.name}`;

    // ── 4. Insert duplicate inside a transaction ──
    const duplicated = await db.transaction(async (tx) => {
      const [newProduct] = await tx
        .insert(products)
        .values({
          name: newName,
          slug: newSlug,
          description: original.description,
          shortDescription: original.shortDescription,
          brand: original.brand,
          sku: original.sku ? `${original.sku}-copy` : null,
          productCode: original.productCode
            ? `${original.productCode}-copy`
            : null,
          categoryId: original.categoryId,
          bannerImageUrl: original.bannerImageUrl,
          content: original.content,
          pdfUrl: original.pdfUrl,
          isFeatured: false,
          isActive: original.isActive,
        })
        .returning();

      const newId = newProduct.id;

      // Categories (junction table)
      if (categoryLinks.length > 0) {
        await tx.insert(productCategories).values(
          categoryLinks.map((c) => ({ productId: newId, categoryId: c.categoryId }))
        );
      }

      // Features
      if (features.length > 0) {
        await tx.insert(productFeatures).values(
          features.map((f) => ({ productId: newId, feature: f.feature }))
        );
      }

      // Specifications
      if (specifications.length > 0) {
        await tx.insert(productSpecifications).values(
          specifications.map((s) => ({
            productId: newId,
            key: s.key,
            value: s.value,
          }))
        );
      }

      // Images
      if (images.length > 0) {
        await tx.insert(productImages).values(
          images.map((img) => ({
            productId: newId,
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary,
          }))
        );
      }

      // DI Terms
      if (diTerms.length > 0) {
        await tx.insert(productDiTerms).values(
          diTerms.map((t) => ({ productId: newId, value: t.value }))
        );
      }

      // Distributors
      if (distributorLinks.length > 0) {
        await tx.insert(productDistributor).values(
          distributorLinks.map((d) => ({
            productId: newId,
            distributorsId: d.distributorsId,
          }))
        );
      }

      return newProduct;
    });

    return NextResponse.json({
      success: true,
      product: duplicated,
    });
  } catch (error: any) {
    console.error("DUPLICATE ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to duplicate product" },
      { status: 500 }
    );
  }
}
