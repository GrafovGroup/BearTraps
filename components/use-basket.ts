"use client";
import { useMemo, useSyncExternalStore } from "react";
import {
  basketSnapshot,
  subscribeBasket,
  parseBasket,
  writeBasket,
} from "@/lib/basket";
export function useBasket() {
  const raw = useSyncExternalStore(subscribeBasket, basketSnapshot, () => "[]");
  const items = useMemo(() => parseBasket(raw), [raw]);
  const ready = useSyncExternalStore(
    subscribeBasket,
    () => true,
    () => false,
  );
  return { items, ready, update: writeBasket };
}
