"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Product, ProductInput } from "../types";

const emptyProduct: ProductInput = {
  id: "",
  name: "",
  description: "",
  priceCents: 0,
  image: "/products/fake-creatina.webp",
  badge: null,
  active: true,
  sortOrder: 10,
};

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function toSlug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function AdminDashboard({ initialProducts, sellerEmail }: { initialProducts: Product[]; sellerEmail: string }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<ProductInput>(emptyProduct);
  const [originalId, setOriginalId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const activeCount = products.filter((product) => product.active).length;

  function openNew() {
    setOriginalId(null);
    setForm({ ...emptyProduct, sortOrder: products.length ? Math.max(...products.map((product) => product.sortOrder)) + 10 : 10 });
    setError(null);
    dialogRef.current?.showModal();
  }

  function openEdit(product: Product) {
    setOriginalId(product.id);
    setForm({ ...product });
    setError(null);
    dialogRef.current?.showModal();
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const id = form.id || toSlug(form.name);
    const payload = { ...form, id };

    try {
      const response = await fetch(originalId ? `/api/products/${encodeURIComponent(originalId)}` : "/api/products", {
        method: originalId ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json() as { product?: Product; error?: string };
      if (!response.ok || !data.product) throw new Error(data.error || "Não foi possível salvar o produto.");
      setProducts((items) => originalId ? items.map((item) => item.id === originalId ? data.product! : item).sort((a, b) => a.sortOrder - b.sortOrder) : [...items, data.product!].sort((a, b) => a.sortOrder - b.sortOrder));
      setNotice(originalId ? "Produto atualizado." : "Produto adicionado.");
      dialogRef.current?.close();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível salvar o produto.");
    } finally {
      setBusy(false);
    }
  }

  async function removeProduct(product: Product) {
    if (!window.confirm(`Remover “${product.name}” da loja?`)) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(product.id)}`, { method: "DELETE" });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Não foi possível remover o produto.");
      setProducts((items) => items.filter((item) => item.id !== product.id));
      setNotice("Produto removido.");
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Não foi possível remover o produto.");
    } finally {
      setBusy(false);
    }
  }

  async function importCatalog() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/products/seed", { method: "POST" });
      const data = await response.json() as { products?: Product[]; error?: string };
      if (!response.ok || !data.products) throw new Error(data.error || "Não foi possível importar o catálogo.");
      setProducts(data.products);
      setNotice("Catálogo inicial importado.");
    } catch (seedError) {
      setError(seedError instanceof Error ? seedError.message : "Não foi possível importar o catálogo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a href="/" className="admin-brand"><img src="/forge-logo.svg" alt="" /><span>CREATINA <strong>FORGE</strong></span></a>
        <div className="admin-account"><span>{sellerEmail}</span><a href="/signout-with-chatgpt?return_to=/">Sair</a></div>
      </header>

      <div className="admin-content">
        <section className="admin-titlebar">
          <div><p className="admin-kicker">PAINEL DO VENDEDOR</p><h1>Produtos e preços</h1><p>As alterações salvas aparecem na loja automaticamente.</p></div>
          <button className="admin-button" type="button" onClick={openNew}>+ Adicionar produto</button>
        </section>

        <section className="admin-stats" aria-label="Resumo do catálogo">
          <article><span>Produtos cadastrados</span><strong>{products.length}</strong></article>
          <article><span>Visíveis na loja</span><strong>{activeCount}</strong></article>
          <article><span>Ocultos</span><strong>{products.length - activeCount}</strong></article>
        </section>

        {notice && <p className="admin-notice" role="status">{notice}<button onClick={() => setNotice(null)} aria-label="Fechar aviso">×</button></p>}
        {error && <p className="admin-error" role="alert">{error}</p>}

        {products.length === 0 ? (
          <section className="admin-empty"><img src="/forge-logo.svg" alt="" /><h2>Catálogo ainda não importado</h2><p>Carregue os produtos atuais da loja para começar a editar preços e informações.</p><button className="admin-button" onClick={importCatalog} disabled={busy}>{busy ? "Importando…" : "Importar catálogo atual"}</button></section>
        ) : (
          <section className="admin-table-card">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Produto</th><th>Preço</th><th>Status</th><th>Ordem</th><th><span className="sr-only">Ações</span></th></tr></thead>
                <tbody>{products.map((product) => (
                  <tr key={product.id}>
                    <td><div className="admin-product-cell"><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>{product.badge || "Sem selo"}</span></div></div></td>
                    <td className="admin-price">{formatPrice(product.priceCents)}</td>
                    <td><span className={`admin-status ${product.active ? "is-active" : "is-hidden-product"}`}>{product.active ? "Visível" : "Oculto"}</span></td>
                    <td>{product.sortOrder}</td>
                    <td><div className="admin-row-actions"><button type="button" onClick={() => openEdit(product)}>Editar</button><button type="button" className="is-danger" onClick={() => removeProduct(product)} disabled={busy}>Remover</button></div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      <dialog className="admin-dialog" ref={dialogRef} onClose={() => setError(null)}>
        <form onSubmit={saveProduct}>
          <div className="admin-dialog-header"><div><p className="admin-kicker">CATÁLOGO</p><h2>{originalId ? "Editar produto" : "Novo produto"}</h2></div><button type="button" className="admin-icon-button" onClick={() => dialogRef.current?.close()} aria-label="Fechar">×</button></div>
          <div className="admin-form-grid">
            <label className="admin-field admin-field--full"><span>Nome do produto</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value, id: originalId ? form.id : toSlug(event.target.value) })} /></label>
            <label className="admin-field"><span>Identificador</span><input required pattern="[a-z0-9-]+" value={form.id} disabled={Boolean(originalId)} onChange={(event) => setForm({ ...form, id: event.target.value })} /></label>
            <label className="admin-field"><span>Preço (R$)</span><input required type="number" min="0" step="0.01" value={(form.priceCents / 100).toFixed(2)} onChange={(event) => setForm({ ...form, priceCents: Math.round(Number(event.target.value) * 100) })} /></label>
            <label className="admin-field admin-field--full"><span>Descrição</span><textarea required rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
            <label className="admin-field admin-field--full"><span>Caminho ou URL da imagem</span><input required value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} /></label>
            <label className="admin-field"><span>Selo opcional</span><input value={form.badge || ""} placeholder="Ex.: MAIS VENDIDO" onChange={(event) => setForm({ ...form, badge: event.target.value || null })} /></label>
            <label className="admin-field"><span>Ordem na loja</span><input required type="number" min="0" step="1" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} /></label>
            <label className="admin-check admin-field--full"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /><span>Exibir este produto na loja</span></label>
          </div>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <div className="admin-dialog-footer"><button type="button" className="admin-button admin-button--secondary" onClick={() => dialogRef.current?.close()}>Cancelar</button><button type="submit" className="admin-button" disabled={busy}>{busy ? "Salvando…" : "Salvar produto"}</button></div>
        </form>
      </dialog>
    </main>
  );
}
