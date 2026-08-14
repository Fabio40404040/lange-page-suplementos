// src/main.js
// Ponto de entrada da aplicação.
// Fluxo: Instagram -> Landing Page -> Produtos -> Carrinho -> WhatsApp

import "./styles/style.css";
import { initCart } from "./app/initCart.js";
import { initProducts } from "./app/initProducts.js";
import { initWhatsApp } from "./app/initWhatsApp.js";

document.addEventListener("DOMContentLoaded", () => {
  const cart = initCart();
  initProducts(cart);
  initWhatsApp();
});
