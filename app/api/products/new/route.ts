import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { eq } from "drizzle-orm";

// GET — return full product objects that are marked as new in the database
export async function GET() {
  try {
    const newProducts = await db
      .select()
      .from(products)
      .where(eq(products.isNew, true));

    return Response.json(newProducts);
  } catch (error) {
    return Response.json({ error: "Failed to fetch new products" }, { status: 500 });
  }
}

// POST — update the product's isNew flag in the database
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, isNew } = body;

    if (!productId) {
      return Response.json({ error: "productId is required" }, { status: 400 });
    }

    await db.update(products).set({ isNew: Boolean(isNew) }).where(eq(products.id, productId));

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .then((rows) => rows[0]);

    return Response.json({ success: true, product });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
