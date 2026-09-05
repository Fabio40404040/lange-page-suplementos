import { requireAdminPage } from "../admin-auth";
import { listAdminProducts } from "../product-repository";
import { signOutPath } from "../chatgpt-auth";
import { AdminDashboard } from "./admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const access = await requireAdminPage();

  if (!access.authorized) {
    return (
      <main className="admin-access-page">
        <section className="admin-access-card">
          <img src="/forge-logo.svg" alt="" />
          <p className="admin-kicker">PAINEL DO VENDEDOR</p>
          <h1>Acesso reservado</h1>
          <p>
            {access.configured
              ? "Esta conta não está autorizada a administrar a loja."
              : "O e-mail do vendedor ainda precisa ser configurado antes do primeiro acesso."}
          </p>
          <div className="admin-access-actions">
            <a href="/" className="admin-button admin-button--secondary">Voltar à loja</a>
            <a href={signOutPath("/admin")} className="admin-button">Trocar de conta</a>
          </div>
        </section>
      </main>
    );
  }

  const products = await listAdminProducts();
  return <AdminDashboard initialProducts={products} sellerEmail={access.user.email} />;
}
