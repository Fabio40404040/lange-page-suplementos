import "@fontsource/anton/400.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/work-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles/admin.css";
import { getProducts, makeProductId, resetProducts, saveProducts, SESSION_KEY } from "./app/catalogStorage.js";

const DEMO_EMAIL = "vendedor@demo.com";
const DEMO_PASSWORD = "forge123";
const $ = (selector) => document.querySelector(selector);
const money = (value) => Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
let uploadedImage = "";

function showDashboard() {
  $("#login-view").classList.add("is-hidden");
  $("#dashboard-view").classList.remove("is-hidden");
  renderProducts();
}

function showLogin() {
  $("#dashboard-view").classList.add("is-hidden");
  $("#login-view").classList.remove("is-hidden");
}

function notify(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function makeButton(label, className, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", action);
  return button;
}

function renderProducts() {
  const products = getProducts().sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  $("#stat-total").textContent = products.length;
  $("#stat-active").textContent = products.filter((item) => item.active !== false).length;
  $("#stat-hidden").textContent = products.filter((item) => item.active === false).length;

  const list = $("#admin-products");
  list.replaceChildren();
  products.forEach((product) => {
    const row = document.createElement("article");
    row.className = `admin-product${product.active === false ? " is-inactive" : ""}`;

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = "";
    image.addEventListener("error", () => { image.src = "/favicon.svg"; }, { once: true });

    const info = document.createElement("div");
    info.className = "admin-product-info";
    const title = document.createElement("h3");
    title.textContent = product.name;
    const description = document.createElement("p");
    description.textContent = product.description;
    const status = document.createElement("span");
    status.className = "product-status";
    status.textContent = product.active === false ? "Oculto" : "Visível";
    info.append(title, description, status);

    const price = document.createElement("strong");
    price.className = "admin-product-price";
    price.textContent = money(product.price);

    const actions = document.createElement("div");
    actions.className = "product-actions";
    actions.append(
      makeButton("Editar", "table-button", () => openProductDialog(product)),
      makeButton(product.active === false ? "Exibir" : "Ocultar", "table-button", () => toggleProduct(product.id)),
      makeButton("Excluir", "table-button table-button-danger", () => removeProduct(product.id, product.name)),
    );

    row.append(image, info, price, actions);
    list.appendChild(row);
  });
}

function openProductDialog(product = null) {
  uploadedImage = "";
  $("#product-form").reset();
  $("#product-error").textContent = "";
  $("#dialog-title").textContent = product ? "Editar produto" : "Novo produto";
  $("#product-id").value = product?.id || "";
  $("#product-name").value = product?.name || "";
  $("#product-price").value = product ? Number(product.price).toFixed(2) : "";
  $("#product-order").value = product?.order ?? getProducts().length + 1;
  $("#product-description").value = product?.description || "";
  $("#product-image").value = product?.image || "";
  $("#product-badge").value = product?.badge || "";
  $("#product-active").checked = product?.active !== false;
  $("#product-dialog").showModal();
}

function closeProductDialog() {
  $("#product-dialog").close();
}

function toggleProduct(id) {
  const products = getProducts().map((item) => item.id === id ? { ...item, active: item.active === false } : item);
  saveProducts(products);
  renderProducts();
  notify("Visibilidade atualizada.");
}

function removeProduct(id, name) {
  if (!window.confirm(`Excluir “${name}” desta demonstração?`)) return;
  saveProducts(getProducts().filter((item) => item.id !== id));
  renderProducts();
  notify("Produto excluído.");
}

$("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("#login-email").value.trim().toLowerCase();
  const password = $("#login-password").value;
  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    $("#login-error").textContent = "Use o e-mail e a senha demonstrativos exibidos acima.";
    return;
  }
  sessionStorage.setItem(SESSION_KEY, "active");
  showDashboard();
});

$("#logout-button").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
});

$("#new-product-button").addEventListener("click", () => openProductDialog());
$("#dialog-close").addEventListener("click", closeProductDialog);
$("#cancel-product").addEventListener("click", closeProductDialog);

$("#product-file").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 700 * 1024) {
    $("#product-error").textContent = "A imagem deve ter no máximo 700 KB.";
    event.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    uploadedImage = String(reader.result);
    $("#product-error").textContent = "";
  });
  reader.readAsDataURL(file);
});

$("#product-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const existingId = $("#product-id").value;
  const products = getProducts();
  const existing = products.find((item) => item.id === existingId);
  const price = Number($("#product-price").value);
  const image = uploadedImage || $("#product-image").value.trim() || existing?.image;
  if (!image) {
    $("#product-error").textContent = "Informe o endereço de uma imagem ou escolha um arquivo.";
    return;
  }
  if (!Number.isFinite(price) || price < 0) {
    $("#product-error").textContent = "Informe um preço válido.";
    return;
  }

  const product = {
    id: existingId || makeProductId($("#product-name").value),
    name: $("#product-name").value.trim(),
    description: $("#product-description").value.trim(),
    price,
    image,
    badge: $("#product-badge").value.trim(),
    active: $("#product-active").checked,
    order: Number($("#product-order").value) || 0,
  };

  const nextProducts = existing
    ? products.map((item) => item.id === existingId ? product : item)
    : [...products, product];
  try {
    saveProducts(nextProducts);
  } catch {
    $("#product-error").textContent = "O navegador ficou sem espaço. Use uma imagem menor ou informe um endereço de imagem.";
    return;
  }
  closeProductDialog();
  renderProducts();
  notify(existing ? "Produto atualizado." : "Produto adicionado.");
});

$("#reset-button").addEventListener("click", () => {
  if (!window.confirm("Restaurar todos os produtos e preços originais da demonstração?")) return;
  resetProducts();
  renderProducts();
  notify("Catálogo original restaurado.");
});

if (sessionStorage.getItem(SESSION_KEY) === "active") showDashboard();
