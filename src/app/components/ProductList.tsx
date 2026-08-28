import { products } from "@/lib/products";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(price);
}

export default function ProductList() {
  return (
    <ul className="w-full divide-y divide-zinc-200 dark:divide-zinc-800">
      {products.map((product) => (
        <li key={product.id} className="flex items-center justify-between py-3">
          <span className="text-base text-zinc-900 dark:text-zinc-100">
            {product.name}
          </span>
          <span className="text-base font-medium text-zinc-900 dark:text-zinc-100">
            {formatPrice(product.price)}
          </span>
        </li>
      ))}
    </ul>
  );
}
