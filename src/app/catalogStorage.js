import { products as defaultProducts } from "./date/products.js";

export const CATALOG_KEY = "forge:demo-catalog:v1";
export const SESSION_KEY = "forge:demo-admin-session";

const cloneDefaults = () => defaultProducts.map((product) => ({ ...product }));

export function getProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(CATALOG_KEY));
    if (Array.isArray(saved)) {
      return saved.map((product) => {
        if (!String(product.image || "").startsWith("/products/")) return product;
        const original = defaultProducts.find((item) => item.id === product.id);
        return original ? { ...product, image: original.image } : product;
      });
    }
  } catch {
    // Um valor inválido é substituído pelo catálogo original.
  }
  return cloneDefaults();
}

export function saveProducts(products) {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(products));
  window.dispatchEvent(new CustomEvent("forge:catalog-changed"));
}

export function resetProducts() {
  localStorage.removeItem(CATALOG_KEY);
  window.dispatchEvent(new CustomEvent("forge:catalog-changed"));
  return cloneDefaults();
}

export function visibleProducts() {
  return getProducts()
    .filter((product) => product.active !== false)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

export function makeProductId(name) {
  const base = String(name || "produto")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "produto";
  return `${base}-${Date.now().toString(36)}`;
}
