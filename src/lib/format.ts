export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(price);
}

export function formatDateTime(isoDate: string) {
  return new Intl.DateTimeFormat("fr-MA", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoDate));
}
