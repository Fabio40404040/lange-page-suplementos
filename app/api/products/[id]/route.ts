import { deleteProduct, updateProduct } from "@/app/product-repository";
import { isAdminRequest } from "@/app/admin-auth";
import { validateProduct } from "../route";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return Response.json({ error: "Acesso não autorizado." }, { status: 403 });
  try {
    const { id } = await context.params;
    const input = validateProduct(await request.json());
    return Response.json({ product: await updateProduct(id, { ...input, id }) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Dados inválidos." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return Response.json({ error: "Acesso não autorizado." }, { status: 403 });
  const { id } = await context.params;
  await deleteProduct(id);
  return Response.json({ ok: true });
}
