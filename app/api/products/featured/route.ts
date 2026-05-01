import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET() {
  try {
    const featuredProducts = await db
      .select()
      .from(products)
      .where(and(eq(products.isFeatured, true), eq(products.isActive, true)));

    return Response.json(featuredProducts);
  } catch (error) {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, isFeatured } = body;

    await db
      .update(products)
      .set({ isFeatured })
      .where(eq(products.id, productId));

    return Response.json({ success: true, message: "Product featured status updated" });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}