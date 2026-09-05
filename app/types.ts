export type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  badge: string | null;
  active: boolean;
  sortOrder: number;
  updatedAt: string;
};

export type ProductInput = Omit<Product, "updatedAt">;
