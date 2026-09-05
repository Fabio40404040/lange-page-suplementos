import { createProduct, listCatalogProducts } from "@/app/product-repository";
import { isAdminRequest } from "@/app/admin-auth";
import type { ProductInput } from "@/app/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ products: await listCatalogProducts() });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return Response.json({ error: "Acesso não autorizado." }, { status: 403 });
  try {
    const input = validateProduct(await request.json());
    return Response.json({ product: await createProduct(input) }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Dados inválidos." }, { status: 400 });
  }
}

export function validateProduct(value: unknown): ProductInput {
  if (!value || typeof value !== "object") throw new Error("Preencha os dados do produto.");
  const item = value as Record<string, unknown>;
  const id = String(item.id || "").trim();
  const name = String(item.name || "").trim();
  const description = String(item.description || "").trim();
  const image = String(item.image || "").trim();
  const priceCents = Number(item.priceCents);
  const sortOrder = Number(item.sortOrder);
  if (!/^[a-z0-9-]{2,80}$/.test(id)) throw new Error("Use um identificador com letras minúsculas, números e hífens.");
  if (!name || name.length > 120) throw new Error("Informe um nome válido.");
  if (!description || description.length > 500) throw new Error("Informe uma descrição válida.");
  if (!image || image.length > 500) throw new Error("Informe uma imagem válida.");
  if (!Number.isInteger(priceCents) || priceCents < 0) throw new Error("Informe um preço válido.");
  if (!Number.isInteger(sortOrder) || sortOrder < 0) throw new Error("Informe uma ordem válida.");
  return { id, name, description, image, priceCents, sortOrder, badge: item.badge ? String(item.badge).trim().slice(0, 40) : null, active: Boolean(item.active) };
}
