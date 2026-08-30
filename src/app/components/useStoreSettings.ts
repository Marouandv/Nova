"use client";

import { useSyncExternalStore } from "react";
import {
  getServerSettingsSnapshot,
  getSettingsSnapshot,
  subscribeToSettings,
  type StoreSettings,
} from "@/lib/store-settings";

// Reads the store settings and re-renders whenever they change, so a saved
// change shows up on the next receipt without a reload.
export function useStoreSettings(): StoreSettings {
  return useSyncExternalStore(
    subscribeToSettings,
    getSettingsSnapshot,
    getServerSettingsSnapshot,
  );
}
