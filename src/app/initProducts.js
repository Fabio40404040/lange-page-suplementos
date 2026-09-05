// src/app/initProducts.js
// Busca os produtos e manda renderizar a grade na landing page,
// além do menu suspenso de produtos no cabeçalho.

import { visibleProducts } from "./catalogStorage.js";
import { renderProductList } from "./components/ProductList.js";
import { initNavProductsMenu } from "./components/NavProductsMenu.js.js";

export function initProducts(cart) {
  const container = document.querySelector("#products-grid");
  if (!container) return;

  const products = visibleProducts();
  renderProductList(products, container, (product) => {
    cart.addItem(product);
    document.dispatchEvent(new CustomEvent("cart:opened-by-add"));
  });

  initNavProductsMenu(products);
}
