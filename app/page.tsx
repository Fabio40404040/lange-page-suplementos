import { listCatalogProducts } from "./product-repository";
import { Storefront } from "./storefront";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await listCatalogProducts();
  return <Storefront products={products} />;
}
