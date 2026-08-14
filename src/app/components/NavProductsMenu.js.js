// src/app/components/NavProductsMenu.js
// Monta o menu suspenso de "Produtos" no cabeçalho, listando todos os
// itens de products.js e levando (scroll) direto pro card ao clicar.

export function initNavProductsMenu(products) {
  const wrapper = document.querySelector(".nav-item-dropdown");
  const toggle = document.querySelector("#nav-produtos-toggle");
  const panel = document.querySelector("#nav-produtos-panel");
  if (!wrapper || !toggle || !panel) return;

  // monta a lista de produtos dentro do painel (só o nome)
  panel.innerHTML = products
    .map(
      (product) => `
        <a class="nav-dropdown-item" href="#product-${product.id}">
          <span>${product.name}</span>
        </a>
      `
    )
    .join("");

  function openPanel() {
    wrapper.classList.add("is-open");
  }
  function closePanel() {
    wrapper.classList.remove("is-open");
  }
  function togglePanel(event) {
    event.preventDefault();
    wrapper.classList.contains("is-open") ? closePanel() : openPanel();
  }

  function hoverEnabled() {
    return window.matchMedia("(hover: hover) and (min-width: 561px)").matches;
  }

  // clique no "Produtos": abre/fecha (funciona em qualquer tamanho de tela)
  toggle.addEventListener("click", togglePanel);

  // hover no desktop: abre direto (só quando o painel está colado no botão)
  wrapper.addEventListener("mouseenter", () => {
    if (hoverEnabled()) openPanel();
  });
  wrapper.addEventListener("mouseleave", () => {
    if (hoverEnabled()) closePanel();
  });

  // clicar num produto do menu: rola até o card e fecha o painel
  panel.addEventListener("click", (event) => {
    const link = event.target.closest(".nav-dropdown-item");
    if (!link) return;
    closePanel();
  });

  // clicar fora do menu fecha o painel
  document.addEventListener("click", (event) => {
    if (!wrapper.contains(event.target)) closePanel();
  });

  // tecla Esc fecha o painel
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePanel();
  });
}
