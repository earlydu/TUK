import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const newProducts = await db
      .select()
      .from(products)
      .where(
        and(eq(products.isActive, true), eq(products.isNew, true)),
      )
      .orderBy(desc(products.createdAt)) // latest first
      .limit(6); // show 6 products

    return Response.json(newProducts);
  } catch (error) {
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}