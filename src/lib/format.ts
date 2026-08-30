import { defaultSettings } from "@/lib/store-settings";

export function formatPrice(
  price: number,
  currency: string = defaultSettings.currency,
) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency,
  }).format(price);
}

export function formatDateTime(isoDate: string) {
  return new Intl.DateTimeFormat("fr-MA", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoDate));
}
