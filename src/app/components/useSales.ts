"use client";

import { useSyncExternalStore } from "react";
import {
  getSales,
  getServerSalesSnapshot,
  subscribeToSales,
  type Sale,
} from "@/lib/sales";

// Reads the recorded sales and re-renders whenever a new one is saved, so
// the dashboard reflects a completed sale without a reload.
export function useSales(): Sale[] {
  return useSyncExternalStore(subscribeToSales, getSales, getServerSalesSnapshot);
}
