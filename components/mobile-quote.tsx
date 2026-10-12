"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBasket } from "./use-basket";
export default function MobileQuote() {
  const path = usePathname();
  const { items } = useBasket();
  if (
    ["/request-quote", "/privacy", "/terms"].some(
      (p) => path.replace(/\/$/, "") === p,
    )
  )
    return null;
  return (
    <aside className="mobile-quote" aria-label="Quote shortcut">
      <Link className="button amber" href="/request-quote/">
        {items.length
          ? `VIEW RFQ (${items.length} ${items.length === 1 ? "LINE" : "LINES"})`
          : "BUILD YOUR RFQ"}{" "}
        ↗
      </Link>
    </aside>
  );
}
