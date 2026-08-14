// src/app/initWhatsApp.js
// Aplica o mesmo número de WhatsApp em todos os botões de contato direto
// (banner, botão flutuante, header), pra nunca ficar número divergente.

const WHATSAPP_NUMBER = "5588999523807";
const DEFAULT_MESSAGE = "Tenho interesse na Creatina Soldiers.";

export function initWhatsApp() {
  const contactButtons = document.querySelectorAll("[data-whatsapp-contact]");

  contactButtons.forEach((btn) => {
    const customMessage = btn.dataset.whatsappMessage || DEFAULT_MESSAGE;
    btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(customMessage)}`;
  });
}
