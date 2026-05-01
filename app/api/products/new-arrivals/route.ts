import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const newProducts = await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt)) // 🔥 latest first
      .limit(6); // show 6 products

    return Response.json(newProducts);
  } catch (error) {
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}