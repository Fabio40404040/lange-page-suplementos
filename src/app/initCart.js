// src/app/initCart.js
// Cria a instância do carrinho e liga a interface do drawer (abrir/fechar/renderizar).

import { Cart, renderCart } from "./components/Cart.js";
import { sendOrderToWhatsApp } from "./components/WhatsApp.js";

export function initCart() {
  const cart = new Cart();

  const elements = {
    badge: document.querySelector("#cart-badge"),
    drawer: document.querySelector("#cart-drawer"),
    backdrop: document.querySelector("#cart-backdrop"),
    openBtn: document.querySelector("#cart-open"),
    closeBtn: document.querySelector("#cart-close"),
    itemsContainer: document.querySelector("#cart-items"),
    totalEl: document.querySelector("#cart-total"),
    emptyEl: document.querySelector("#cart-empty"),
    checkoutBtn: document.querySelector("#cart-checkout"),
  };

  function openDrawer() {
    elements.drawer.classList.add("is-open");
    elements.backdrop.classList.add("is-open");
    elements.drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    elements.drawer.classList.remove("is-open");
    elements.backdrop.classList.remove("is-open");
    elements.drawer.setAttribute("aria-hidden", "true");
  }

  elements.openBtn?.addEventListener("click", openDrawer);
  elements.closeBtn?.addEventListener("click", closeDrawer);
  elements.backdrop?.addEventListener("click", closeDrawer);
  document.addEventListener("cart:opened-by-add", openDrawer);

  cart.onChange(() => renderCart(cart, elements, sendOrderToWhatsApp));
  renderCart(cart, elements, sendOrderToWhatsApp);

  return cart;
}
