import { lineSchema, categoryLine, type BasketItem } from "./line-items.ts";
export type { BasketItem } from "./line-items.ts";
export const basketKey = "beartraps-rfq-v2";
export function parseBasket(raw: string): BasketItem[] {
  try {
    if (raw.length > 100000) return [];
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const lines: BasketItem[] = [];
    const ids = new Set<string>();
    for (const entry of value.slice(0, 50)) {
      const candidate =
        entry && typeof entry === "object" && "slug" in entry
          ? { ...categoryLine(entry.slug), quantity: entry.quantity }
          : entry;
      const parsed = lineSchema.safeParse(candidate);
      if (parsed.success && !ids.has(parsed.data.id)) {
        ids.add(parsed.data.id);
        lines.push(parsed.data);
      }
    }
    return lines;
  } catch {
    return [];
  }
}
let memory: string | null = null;
export function basketSnapshot() {
  if (memory !== null) return memory;
  try {
    return (
      localStorage.getItem(basketKey) ||
      localStorage.getItem("beartraps-rfq-v1") ||
      "[]"
    );
  } catch {
    return "[]";
  }
}
export function subscribeBasket(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener("basket-updated", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener("basket-updated", notify);
  };
}
export function writeBasket(items: BasketItem[]) {
  const raw = JSON.stringify(items);
  memory = raw;
  let saved = false;
  try {
    localStorage.setItem(basketKey, raw);
    localStorage.removeItem("beartraps-rfq-v1");
    memory = null;
    saved = true;
  } catch {}
  window.dispatchEvent(new Event("basket-updated"));
  return saved;
}
export function readBasket() {
  return parseBasket(basketSnapshot());
}
