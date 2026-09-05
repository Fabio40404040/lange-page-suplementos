import { isAdminRequest } from "@/app/admin-auth";
import { seedDefaultProducts } from "@/app/product-repository";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isAdminRequest())) return Response.json({ error: "Acesso não autorizado." }, { status: 403 });
  return Response.json({ products: await seedDefaultProducts() });
}
