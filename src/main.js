// src/main.js
// Ponto de entrada da aplicação.
// Fluxo: Instagram -> Landing Page -> Produtos -> Carrinho -> WhatsApp

// Fontes auto-hospedadas (empacotadas pelo Vite, sem depender do Google
// Fonts CDN) — resolve a instabilidade no navegador interno do WhatsApp.
import "@fontsource/anton/400.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/work-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";

import "./styles/style.css";
import { initCart } from "./app/initCart.js";
import { initProducts } from "./app/initProducts.js";
import { initWhatsApp } from "./app/initWhatsApp.js";

document.addEventListener("DOMContentLoaded", () => {
  const cart = initCart();
  initProducts(cart);
  initWhatsApp();
});
