"use client";
import { useState } from "react";
import Link from "next/link";
import { categories } from "@/lib/catalog";
import type { CategoryId } from "@/lib/categories";
import { categoryLine, mergeLines } from "@/lib/line-items";
import { readBasket, writeBasket } from "@/lib/basket";
const choices: CategoryId[] = [
  "bear-traps",
  "transport-trailers",
  "warning-signage",
  "wildlife-equipment",
  "lures-supplies",
];
export default function EquipmentPackage() {
  const [selected, setSelected] = useState<CategoryId[]>(choices.slice(0, 4));
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [status, setStatus] = useState("");
  const [added, setAdded] = useState(false);
  return (
    <div className="package-builder">
      <fieldset>
        <legend>CHOOSE YOUR PACKAGE REQUIREMENTS</legend>
        {choices.map((slug) => {
          const c = categories.find((c) => c.slug === slug)!;
          return (
            <div className="package-choice" key={slug}>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={selected.includes(slug)}
                  onChange={(e) =>
                    setSelected((s) =>
                      e.target.checked
                        ? [...s, slug]
                        : s.filter((x) => x !== slug),
                    )
                  }
                />
                <span>
                  <strong>{c.title}</strong>
                  <small>{c.summary}</small>
                </span>
              </label>
              <label className="field">
                <span>QUANTITY</span>
                <input
                  type="number"
                  aria-label={"Package quantity for " + c.short}
                  min="1"
                  max="99999"
                  value={quantities[slug] || 1}
                  disabled={!selected.includes(slug)}
                  onChange={(e) =>
                    setQuantities((q) => ({
                      ...q,
                      [slug]: Math.max(
                        1,
                        Math.min(
                          99999,
                          Math.trunc(Number(e.target.value) || 1),
                        ),
                      ),
                    }))
                  }
                />
              </label>
            </div>
          );
        })}
      </fieldset>
      <p className="compliance-notice">
        This package is a coordinated sourcing request. It does not establish
        product compatibility, availability or legal eligibility. Capture
        equipment and consumables require human review for the buyer and
        destination.
      </p>
      <button
        className="button amber"
        disabled={!selected.length}
        onClick={() => {
          try {
            const next = mergeLines(
              readBasket(),
              selected.map((slug) => ({
                ...categoryLine(slug),
                quantity: quantities[slug] || 1,
              })),
            );
            const saved = writeBasket(next);
            setAdded(true);
            setStatus(
              saved
                ? "Package requirements added to your RFQ."
                : "Package added for this tab. Browser storage is unavailable.",
            );
          } catch (e) {
            setStatus((e as Error).message);
          }
        }}
      >
        ADD PACKAGE TO RFQ +
      </button>
      {added && (
        <Link className="inline-link" href="/request-quote/">
          REVIEW YOUR RFQ →
        </Link>
      )}
      <p role="status">{status}</p>
    </div>
  );
}
