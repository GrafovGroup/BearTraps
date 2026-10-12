"use client";
import { useState } from "react";
import Link from "next/link";
import { readBasket, writeBasket } from "@/lib/basket";
import { categoryLine, mergeLines, type BasketItem } from "@/lib/line-items";
import type { CategoryId } from "@/lib/categories";
export default function AddToQuote({
  slug,
  line,
}: {
  slug: CategoryId;
  line?: BasketItem;
}) {
  const [added, setAdded] = useState(false);
  const [status, setStatus] = useState("");
  return (
    <div>
      <button
        className="button amber"
        onClick={() => {
          try {
            const saved = writeBasket(
              mergeLines(readBasket(), [line || categoryLine(slug)]),
            );
            setAdded(true);
            setStatus(
              saved
                ? ""
                : "Selection retained for this tab. Browser storage is unavailable.",
            );
          } catch (e) {
            setStatus(
              e instanceof Error ? e.message : "Could not add the selection.",
            );
          }
        }}
      >
        {added ? "ADDED TO RFQ ✓" : "ADD REQUIREMENT TO RFQ + "}
      </button>
      {added && (
        <Link className="inline-link" href="/request-quote">
          VIEW YOUR RFQ →
        </Link>
      )}
      <p role="status">{status}</p>
    </div>
  );
}
