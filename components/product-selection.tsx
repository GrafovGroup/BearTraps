"use client";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import AddToQuote from "./add-to-quote";
export default function ProductSelection({ product: p }: { product: Product }) {
  const [variantId, setVariant] = useState("");
  return (
    <div>
      {p.variants.length > 0 && (
        <label className="field">
          <span>MODEL / VARIANT</span>
          <select
            value={variantId}
            onChange={(e) => setVariant(e.target.value)}
          >
            <option value="">Base model</option>
            {p.variants.map((v) => (
              <option value={v.id} key={v.id}>
                {v.label} — {v.sku}
              </option>
            ))}
          </select>
        </label>
      )}
      <AddToQuote
        key={variantId}
        slug={p.category}
        line={{
          id: "product:" + p.slug + ":" + variantId,
          kind: "product",
          category: p.category,
          productSlug: p.slug,
          variantId: variantId || undefined,
          title: "",
          quantity: 1,
          specifications: "",
        }}
      />
    </div>
  );
}
