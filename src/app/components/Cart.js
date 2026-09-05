// src/app/components/Cart.js
// Estado do carrinho + renderização do painel (drawer) do carrinho.
// O estado fica salvo no localStorage, então o carrinho sobrevive a um refresh.

// const STORAGE_KEY = "soldiers:cart";

// function loadCart() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// }

// function saveCart(items) {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
//   } catch {
//     /* localStorage indisponível: carrinho segue só em memória */
//   }
// }

// function formatPrice(value) {
//   return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
// }

// export class Cart {
//   constructor() {
//     this.items = loadCart();
//     this.listeners = [];
//   }

//   onChange(callback) {
//     this.listeners.push(callback);
//   }

//   emit() {
//     saveCart(this.items);
//     this.listeners.forEach((cb) => cb(this.items));
//   }

//   addItem(product) {
//     const existing = this.items.find((item) => item.id === product.id);
//     if (existing) {
//       existing.qty += 1;
//     } else {
//       this.items.push({ ...product, qty: 1 });
//     }
//     this.emit();
//   }

//   removeItem(productId) {
//     this.items = this.items.filter((item) => item.id !== productId);
//     this.emit();
//   }

//   updateQty(productId, qty) {
//     const item = this.items.find((i) => i.id === productId);
//     if (!item) return;
//     item.qty = Math.max(1, qty);
//     this.emit();
//   }

//   clear() {
//     this.items = [];
//     this.emit();
//   }

//   getTotalItems() {
//     return this.items.reduce((sum, item) => sum + item.qty, 0);
//   }

//   getTotalPrice() {
//     return this.items.reduce((sum, item) => sum + item.qty * item.price, 0);
//   }
// }

// export function renderCart(cart, elements, onCheckout) {
//   const { badge, itemsContainer, totalEl, emptyEl, checkoutBtn } = elements;

//   badge.textContent = cart.getTotalItems();
//   badge.classList.toggle("is-hidden", cart.getTotalItems() === 0);

//   itemsContainer.innerHTML = "";

//   if (cart.items.length === 0) {
//     emptyEl.classList.remove("is-hidden");
//     checkoutBtn.setAttribute("disabled", "true");
//   } else {
//     emptyEl.classList.add("is-hidden");
//     checkoutBtn.removeAttribute("disabled");

//     cart.items.forEach((item) => {
//       const row = document.createElement("div");
//       row.className = "cart-item";
//       row.innerHTML = `
//         <img src="${item.image}" alt="${item.name}">
//         <div class="cart-item-info">
//           <p class="cart-item-name">${item.name}</p>
//           <p class="cart-item-price">${formatPrice(item.price)}</p>
//           <div class="cart-item-qty">
//             <button type="button" class="qty-btn js-qty-minus" aria-label="Diminuir quantidade">−</button>
//             <span>${item.qty}</span>
//             <button type="button" class="qty-btn js-qty-plus" aria-label="Aumentar quantidade">+</button>
//           </div>
//         </div>
//         <button type="button" class="cart-item-remove js-remove" aria-label="Remover item">
//           <i class="fa-regular fa-trash-can" style="color: #f8f7f5;"></i> 
//         </button>
//       `;

//       row.querySelector(".js-qty-minus").addEventListener("click", () => {
//         cart.updateQty(item.id, item.qty - 1);
//       });
//       row.querySelector(".js-qty-plus").addEventListener("click", () => {
//         cart.updateQty(item.id, item.qty + 1);
//       });
//       row.querySelector(".js-remove").addEventListener("click", () => {
//         cart.removeItem(item.id);
//       });

//       itemsContainer.appendChild(row);
//     });
//   }

//   totalEl.textContent = formatPrice(cart.getTotalPrice());
//   checkoutBtn.onclick = () => onCheckout(cart);
// }


// src/app/components/Cart.js
// Estado do carrinho + renderização do painel (drawer) do carrinho.
// O estado fica salvo no localStorage, então o carrinho sobrevive a um refresh.

const STORAGE_KEY = "forge:cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* localStorage indisponível: carrinho segue só em memória */
  }
}

function formatPrice(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export class Cart {
  constructor() {
    this.items = loadCart();
    this.listeners = [];
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  emit() {
    saveCart(this.items);
    this.listeners.forEach((cb) => cb(this.items));
  }

  addItem(product) {
    const existing = this.items.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ ...product, qty: 1 });
    }
    this.emit();
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.emit();
  }

  updateQty(productId, qty) {
    const item = this.items.find((i) => i.id === productId);
    if (!item) return;
    item.qty = Math.max(1, qty);
    this.emit();
  }

  clear() {
    this.items = [];
    this.emit();
  }

  getTotalItems() {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }

  getTotalPrice() {
    return this.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  }
}

export function renderCart(cart, elements, onCheckout) {
  const { badge, itemsContainer, totalEl, emptyEl, checkoutBtn } = elements;

  badge.textContent = cart.getTotalItems();
  badge.classList.toggle("is-hidden", cart.getTotalItems() === 0);

  itemsContainer.innerHTML = "";

  if (cart.items.length === 0) {
    emptyEl.classList.remove("is-hidden");
    checkoutBtn.setAttribute("disabled", "true");
  } else {
    emptyEl.classList.add("is-hidden");
    checkoutBtn.removeAttribute("disabled");

    cart.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
          <div class="cart-item-qty">
            <button type="button" class="qty-btn js-qty-minus" aria-label="Diminuir quantidade">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <span>${item.qty}</span>
            <button type="button" class="qty-btn js-qty-plus" aria-label="Aumentar quantidade">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
        <button type="button" class="cart-item-remove js-remove" aria-label="Remover item">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      `;

      row.querySelector(".js-qty-minus").addEventListener("click", () => {
        cart.updateQty(item.id, item.qty - 1);
      });
      row.querySelector(".js-qty-plus").addEventListener("click", () => {
        cart.updateQty(item.id, item.qty + 1);
      });
      row.querySelector(".js-remove").addEventListener("click", () => {
        cart.removeItem(item.id);
      });

      itemsContainer.appendChild(row);
    });
  }

  totalEl.textContent = formatPrice(cart.getTotalPrice());
  checkoutBtn.onclick = () => onCheckout(cart);
}
