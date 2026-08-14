// src/app/components/ProductList.js
// Renderiza a lista/grade de produtos dentro de um container.

import { createProductCard } from "./ProductCard.js";

export function renderProductList(products, container, onAddToCart) {
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    fragment.appendChild(createProductCard(product, onAddToCart));
  });

  container.appendChild(fragment);
}
