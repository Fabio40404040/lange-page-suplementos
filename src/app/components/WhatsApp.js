// src/app/components/WhatsApp.js
// Monta a mensagem do pedido a partir do carrinho e abre o WhatsApp.

// const WHATSAPP_NUMBER = "5588999523807"; // formato: DDI + DDD + número

// function formatPrice(value) {
//   return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
// }

// export function buildOrderMessage(cart) {
//   const lines = [
//     "Olá! Quero fazer um pedido da Creatina Soldiers:",
//     "",
//     ...cart.items.map(
//       (item) => `• ${item.qty}x ${item.name} — ${formatPrice(item.price * item.qty)}`
//     ),
//     "",
//     `Total: ${formatPrice(cart.getTotalPrice())}`,
//     "",
//     "Podemos combinar pagamento e entrega?",
//   ];
//   return lines.join("\n");
// }

// export function sendOrderToWhatsApp(cart) {
//   const message = buildOrderMessage(cart);
//   const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
//   window.open(url, "_blank", "noopener");
// }

// src/app/components/WhatsApp.js
// Monta a mensagem do pedido a partir do carrinho e abre o WhatsApp.

const WHATSAPP_NUMBER = "5588999523807"; // formato: DDI + DDD + número

function formatPrice(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Transforma o caminho relativo da imagem (./src/app/assets/img/x.png)
// numa URL absoluta, baseada no domínio onde o site está publicado.
// O WhatsApp só consegue gerar a prévia de imagem se o link for absoluto
// e publicamente acessível (não funciona em localhost).
function toAbsoluteImageUrl(relativePath) {
  const cleanPath = relativePath.replace(/^\.\//, "");
  return new URL(cleanPath, window.location.origin).href;
}

export function buildOrderMessage(cart) {
  const lines = [
    "Olá! Quero fazer um pedido da Creatina Soldiers:",
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