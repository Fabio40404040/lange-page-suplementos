// src/app/components/WhatsApp.js
// Monta a mensagem do pedido a partir do carrinho e abre o WhatsApp.

// Número propositalmente fictício para esta demonstração.
const WHATSAPP_NUMBER = "5500000000000";

function formatPrice(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function toAbsoluteImageUrl(relativePath) {
  const cleanPath = relativePath.replace(/^\.\//, "");
  return new URL(cleanPath, window.location.origin).href;
}

export function buildOrderMessage(cart) {
  const lines = [
    "Olá! Quero fazer um pedido da Creatina Forge:",
    "",
    ...cart.items.map(
      (item) =>
        `• ${item.qty}x ${item.name} — ${formatPrice(item.price * item.qty)}\n  Foto: ${toAbsoluteImageUrl(item.image)}`
    ),
    "",
    `Total: ${formatPrice(cart.getTotalPrice())}`,
    "",
    "Podemos combinar pagamento e entrega?",
  ];
  return lines.join("\n");
}

export function sendOrderToWhatsApp(cart) {
  const message = buildOrderMessage(cart);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}
