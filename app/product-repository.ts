import { asc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { defaultProducts } from "./default-products";
import type { Product, ProductInput } from "./types";

export async function listCatalogProducts(): Promise<Product[]> {
  try {
    const rows = await getDb()
      .select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(asc(products.sortOrder), asc(products.name));
    return rows.length ? rows : defaultProducts.filter((product) => product.active);
  } catch {
    return defaultProducts.filter((product) => product.active);
  }
}

export async function listAdminProducts(): Promise<Product[]> {
  return getDb().select().from(products).orderBy(asc(products.sortOrder), asc(products.name));
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const row = { ...input, updatedAt: new Date().toISOString() };
  await getDb().insert(products).values(row);
  return row;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const row = { ...input, id, updatedAt: new Date().toISOString() };
  await getDb().update(products).set(row).where(eq(products.id, id));
  return row;
}

export async function deleteProduct(id: string): Promise<void> {
  await getDb().delete(products).where(eq(products.id, id));
}

export async function seedDefaultProducts(): Promise<Product[]> {
  const statements = defaultProducts.map((product) =>
    env.DB.prepare(
      `INSERT INTO products
        (id, name, description, price_cents, image, badge, active, sort_order, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO NOTHING`,
    ).bind(
      product.id,
      product.name,
      product.description,
      product.priceCents,
      product.image,
      product.badge,
      product.active ? 1 : 0,
      product.sortOrder,
      product.updatedAt,
    ),
  );
  await env.DB.batch(statements);
  return listAdminProducts();
}
