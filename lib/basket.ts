import { categories } from "./catalog";
export type BasketItem = { slug: string; quantity: number };
export const basketKey = "beartraps-rfq-v1";
export function parseBasket(raw: string): BasketItem[] {
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value
      .filter(
        (i): i is BasketItem =>
          !!i &&
          typeof i === "object" &&
          categories.some((c) => c.slug === i.slug) &&
          Number.isInteger(i.quantity) &&
          i.quantity >= 1 &&
          i.quantity <= 9999,
      )
      .slice(0, 7);
  } catch {
    return [];
  }
}
export function writeBasket(items: BasketItem[]) {
  localStorage.setItem(basketKey, JSON.stringify(items));
}

export function readBasket(): BasketItem[] {
  try {
    return parseBasket(localStorage.getItem(basketKey) || "[]");
  } catch {
    return [];
  }
}
