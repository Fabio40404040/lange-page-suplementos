import type { Product } from "./types";

const updatedAt = "2026-09-05T00:00:00.000Z";

export const defaultProducts: Product[] = [
  { id: "unidade", name: "Creatina - 1 Unidade 300g", description: "1 pote (100 doses). Ideal pra quem quer testar sem compromisso.", priceCents: 7990, image: "/products/fake-creatina.webp", badge: null, active: true, sortOrder: 10, updatedAt },
  { id: "kit-duplo", name: "Creatina - 2 Unidades 300g", description: "2 potes. Melhor custo-benefício pra manter a rotina sem parar.", priceCents: 13990, image: "/products/fake-creatina.webp", badge: "MAIS VENDIDO", active: true, sortOrder: 20, updatedAt },
  { id: "kit-trio", name: "Creatina - 3 Unidades 300g", description: "3 potes. Estoque pra vários meses de treino sem se preocupar.", priceCents: 19990, image: "/products/fake-creatina.webp", badge: null, active: true, sortOrder: 30, updatedAt },
  { id: "creatina-refil-500g", name: "Creatina - 1 Unidade 500g", description: "Creatina monohidratada pura, refil econômico de 500g.", priceCents: 9990, image: "/products/fake-creatina-refil.webp", badge: null, active: true, sortOrder: 40, updatedAt },
  { id: "creatina-refil-500g-kit2", name: "Creatina - 2 Unidades 500g", description: "2 refis de creatina de 500g.", priceCents: 17990, image: "/products/fake-creatina-refil.webp", badge: "MAIS VENDIDO", active: true, sortOrder: 50, updatedAt },
  { id: "omega3-60", name: "Ômega 3 - 60 Cápsulas", description: "60 cápsulas de 1000mg de óleo de peixe.", priceCents: 7490, image: "/products/fake-omega3.webp", badge: null, active: true, sortOrder: 60, updatedAt },
  { id: "multivitaminico-60", name: "Multivitamínico - 60 Cápsulas", description: "60 cápsulas.", priceCents: 5490, image: "/products/fake-multivitaminico.webp", badge: null, active: true, sortOrder: 70, updatedAt },
  { id: "pre-treino", name: "Pré-Treino Forge", description: "Fórmula com cafeína, beta-alanina, citrulina malato e creatina.", priceCents: 9990, image: "/products/fake-pre-treino.webp", badge: null, active: true, sortOrder: 80, updatedAt },
  { id: "xilitol-500g", name: "Xilitol Forge - 500g", description: "Adoçante natural.", priceCents: 3490, image: "/products/fake-xilitol.webp", badge: null, active: true, sortOrder: 90, updatedAt },
  { id: "xilitol-1kg", name: "Xilitol Forge - 1kg", description: "Xilitol em embalagem de 1kg.", priceCents: 5990, image: "/products/fake-xilitol.webp", badge: null, active: true, sortOrder: 100, updatedAt },
  { id: "vitamina-c-250g", name: "Vitamina C Forge - 250g", description: "Vitamina C em pó.", priceCents: 4990, image: "/products/fake-vitamina-c.webp", badge: null, active: true, sortOrder: 110, updatedAt },
  { id: "protein-bar-caixa12", name: "Protein Bar Forge - Caixa 12", description: "Caixa com 12 barras de proteína.", priceCents: 8990, image: "/products/fake-protein-bar.webp", badge: null, active: true, sortOrder: 120, updatedAt },
  { id: "whey-protein", name: "Whey Protein Forge", description: "Pote de whey protein concentrado.", priceCents: 13990, image: "/products/fake-whey.webp", badge: null, active: true, sortOrder: 130, updatedAt },
  { id: "kit-omega-multi", name: "Kit Ômega 3 + Multivitamínico", description: "Combo com Ômega 3 e Multivitamínico.", priceCents: 23990, image: "/products/fake-kit-omega-multi.webp", badge: "COMBO", active: true, sortOrder: 140, updatedAt },
  { id: "kit-whey-creatina-pre-treino", name: "Kit Whey + Creatina + Pré-Treino", description: "Combo Whey Protein + Creatina + Pré-Treino.", priceCents: 23990, image: "/products/fake-kit-whey-creatina-pre.webp", badge: "COMBO", active: true, sortOrder: 150, updatedAt },
];
