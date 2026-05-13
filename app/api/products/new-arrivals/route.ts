import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get("all") === "true";

    const query = db
      .select()
      .from(products)
      .where(
        and(eq(products.isActive, true), eq(products.isNew, true)),
      )
      .orderBy(desc(products.createdAt)); // latest first

    const newProducts = fetchAll
      ? await query
      : await query.limit(6); // show 6 products on homepage

    return Response.json(newProducts);
  } catch (error) {
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}