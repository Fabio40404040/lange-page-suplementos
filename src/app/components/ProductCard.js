// src/app/components/ProductCard.js
// Cria o elemento DOM de um único produto.

function formatPrice(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function createProductCard(product, onAddToCart) {
  const card = document.createElement("article");
  card.className = "offer-card" + (product.badge ? " offer-card--highlight" : "");
  card.dataset.productId = product.id;
  card.id = `product-${product.id}`;

  card.innerHTML = `
    ${product.badge ? `<span class="offer-badge">${product.badge}</span>` : ""}
    <img src="${product.image}" alt="${product.name}">
    <div class="offer-body">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p class="offer-price">${formatPrice(product.price)}</p>
      <button type="button" class="btn btn-primary btn-block js-add-to-cart">
        Adicionar ao carrinho
      </button>
    </div>
  `;

  const button = card.querySelector(".js-add-to-cart");
  button.addEventListener("click", () => {
    onAddToCart(product);
    button.textContent = "Adicionado ✓";
    button.classList.add("is-added");
    setTimeout(() => {
      button.textContent = "Adicionar ao carrinho";
      button.classList.remove("is-added");
    }, 1200);
  });

  return card;
}
