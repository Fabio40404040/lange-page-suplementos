"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "./types";

type CartItem = Product & { qty: number };

const WHATSAPP_NUMBER = "5500000000000";
const CART_KEY = "forge:cart";

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function contactUrl(message = "Tenho interesse na Creatina Forge.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function Storefront({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]") as CartItem[];
      const current = new Map(products.map((product) => [product.id, product]));
      setCart(
        saved.flatMap((item) => {
          const product = current.get(item.id);
          return product ? [{ ...product, qty: Math.max(1, item.qty || 1) }] : [];
        }),
      );
    } catch {
      setCart([]);
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.priceCents * item.qty, 0), [cart]);

  function addToCart(product: Product) {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      return existing
        ? items.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
        : [...items, { ...product, qty: 1 }];
    });
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1200);
  }

  function changeQty(id: string, change: number) {
    setCart((items) => items.map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item));
  }

  function checkout() {
    const lines = [
      "Olá! Quero fazer um pedido da Creatina Forge:",
      "",
      ...cart.map((item) => `• ${item.qty}x ${item.name} — ${formatPrice(item.priceCents * item.qty)}`),
      "",
      `Total: ${formatPrice(totalPrice)}`,
      "",
      "Podemos combinar pagamento e entrega?",
    ];
    window.open(contactUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="topbar"><span>ENVIO RÁPIDO • VENDA DIRETA • ATENDIMENTO NO WHATSAPP</span></div>
      <header className="site-header">
        <div className="container header-inner">
          <a href="#topo" className="brand"><img className="brand-mark" src="/forge-logo.svg" alt="" />CREATINA<span>FORGE</span></a>
          <nav className="main-nav" aria-label="Navegação principal"><ul><li><a href="#produtos">Produtos</a></li></ul></nav>
          <div className="header-actions">
            <a className="btn btn-ghost header-cta" href={contactUrl()} target="_blank" rel="noreferrer">Chamar no Zap</a>
            <button type="button" className="cart-icon-btn" onClick={() => setCartOpen(true)} aria-label="Abrir carrinho">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="topo">
          <div className="hero-banner">
            <img className="hero-banner-img" src="/products/fake-hero-forge-olive.webp" alt="Banner da Creatina Forge" />
            <a className="hero-whats-btn" href={contactUrl()} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.14c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.15-4.9-4.34-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.19-.15.31-.3.48-.14.17-.31.37-.44.5-.14.14-.29.29-.13.57.17.29.75 1.24 1.61 2.01 1.11.99 2.05 1.29 2.33 1.44.28.14.45.12.61-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.14.26.1 1.66.79 1.94.93.28.14.47.21.53.33.07.12.07.68-.17 1.36z"/></svg>
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </section>

        <section className="section section-dark" id="produtos">
          <div className="container">
            <p className="eyebrow">MUNIÇÃO EM ESTOQUE</p>
            <h1 className="section-title">Escolha seu pedido</h1>
            <div className="offers-grid">
              {products.map((product) => (
                <article key={product.id} id={`product-${product.id}`} className={`offer-card${product.badge ? " offer-card--highlight" : ""}`}>
                  {product.badge && <span className="offer-badge">{product.badge}</span>}
                  <img src={product.image} alt={product.name} />
                  <div className="offer-body">
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p className="offer-price">{formatPrice(product.priceCents)}</p>
                    <button type="button" className={`btn btn-primary btn-block${addedId === product.id ? " is-added" : ""}`} onClick={() => addToCart(product)}>
                      {addedId === product.id ? "Adicionado ✓" : "Adicionar ao carrinho"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="seller-note">
          <div className="container seller-note-inner">
            <div className="seller-note-avatar"><img src="/products/fake-vendedor.webp" alt="Retrato fictício do vendedor" /></div>
            <div className="seller-note-text">
              <p><strong>Vendo direto, sem intermediário</strong> — sou eu quem separa, embala e responde cada dúvida pessoalmente pelo WhatsApp. Produto original, com lacre de segurança, e combinamos juntos o pagamento e a entrega.</p>
              <a className="btn btn-outline" href={contactUrl()} target="_blank" rel="noreferrer">Falar comigo agora</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="container footer-inner"><p className="brand brand-footer"><img className="brand-mark" src="/forge-logo.svg" alt="" />CREATINA<span>FORGE</span></p><p className="footer-text">Venda direta de pessoa física. Produto original. Dúvidas? Fale diretamente comigo pelo WhatsApp.</p></div></footer>
      <a className="whatsapp-fixed" href={contactUrl("Olá! Quero saber mais sobre a Creatina Forge.")} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">WhatsApp</a>

      <div className={`cart-backdrop${cartOpen ? " is-open" : ""}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer${cartOpen ? " is-open" : ""}`} aria-hidden={!cartOpen}>
        <div className="cart-drawer-header"><h2>Seu pedido</h2><button type="button" className="cart-close-btn" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho">✕</button></div>
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt="" />
              <div><p className="cart-item-name">{item.name}</p><p className="cart-item-price">{formatPrice(item.priceCents)}</p><div className="cart-item-qty"><button className="qty-btn" onClick={() => changeQty(item.id, -1)} aria-label="Diminuir quantidade">−</button><span>{item.qty}</span><button className="qty-btn" onClick={() => changeQty(item.id, 1)} aria-label="Aumentar quantidade">+</button></div></div>
              <button className="cart-item-remove" onClick={() => setCart((items) => items.filter((product) => product.id !== item.id))} aria-label="Remover item">✕</button>
            </div>
          ))}
        </div>
        {cart.length === 0 && <p className="cart-empty">Seu carrinho está vazio. Adicione um produto pra começar.</p>}
        <div className="cart-drawer-footer"><div className="cart-total-row"><span>Total</span><strong>{formatPrice(totalPrice)}</strong></div><button type="button" className="btn btn-primary btn-block" disabled={!cart.length} onClick={checkout}>Finalizar pedido no WhatsApp</button></div>
      </aside>
    </>
  );
}
