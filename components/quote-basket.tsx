"use client";
import { useState } from "react";
import Link from "next/link";
import { categories } from "@/lib/catalog";
import {
  categoryLine,
  lineTitle,
  mergeLines,
  type BasketItem,
} from "@/lib/line-items";
export default function QuoteBasket({
  items,
  ready,
  update,
  error,
}: {
  items: BasketItem[];
  ready: boolean;
  update: (items: BasketItem[]) => void;
  error?: string;
}) {
  const [custom, setCustom] = useState("");
  const [category, setCategory] =
    useState<BasketItem["category"]>("bear-traps");
  const [notice, setNotice] = useState("");
  return (
    <aside className="basket" id="items">
      <p className="eyebrow">01 / EQUIPMENT LIST</p>
      <h2>Your requirements</h2>
      <p>
        Use categories, exact published models or custom sourcing lines.
        Specifications entered here are saved on this device with your basket.
      </p>
      <label className="field">
        <span>ADD EQUIPMENT</span>
        <select
          aria-label="ADD EQUIPMENT"
          value=""
          disabled={!ready}
          onChange={(e) => {
            if (e.target.value) {
              try {
                update(
                  mergeLines(items, [
                    categoryLine(e.target.value as BasketItem["category"]),
                  ]),
                );
                setNotice("");
              } catch (e) {
                setNotice((e as Error).message);
              }
            }
          }}
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.short}
            </option>
          ))}
        </select>
      </label>
      <details className="custom-source">
        <summary>ADD CUSTOM SOURCING LINE</summary>
        <label className="field">
          <span>CUSTOM REQUIREMENT</span>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            maxLength={160}
            placeholder="Describe the equipment or model needed"
          />
        </label>
        <label className="field">
          <span>SOURCING CATEGORY</span>
          <select
            aria-label="SOURCING CATEGORY"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as BasketItem["category"])
            }
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.short}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="button dark"
          disabled={!ready}
          onClick={() => {
            if (custom.trim().length < 3) {
              setNotice(
                "Describe the custom requirement in at least three characters.",
              );
              return;
            }
            if (items.length >= 50) {
              setNotice("Use at most 50 line items.");
              return;
            }
            update([
              ...items,
              {
                id: "custom:" + crypto.randomUUID(),
                kind: "custom",
                category,
                title: custom.trim(),
                quantity: 1,
                specifications: "",
              },
            ]);
            setCustom("");
            setNotice("Custom sourcing line added.");
          }}
        >
          ADD SOURCING LINE +
        </button>
        <p role="status">{notice}</p>
      </details>
      {!items.length && (
        <p className="empty-basket">Your equipment list is empty.</p>
      )}
      {items.map((line, index) => (
        <div className="basket-item" key={line.id}>
          <h3>
            {index + 1}. {lineTitle(line)}
          </h3>
          <p className="line-kind">
            {line.kind === "custom"
              ? "CUSTOM SOURCING"
              : line.kind === "product"
                ? "PRODUCT / MODEL"
                : "CATEGORY REQUIREMENT"}
          </p>
          <div>
            <label>
              QUANTITY
              <input
                aria-label={"Quantity for " + lineTitle(line)}
                type="number"
                min="1"
                max="99999"
                value={line.quantity}
                onChange={(e) =>
                  update(
                    items.map((i) =>
                      i.id === line.id
                        ? {
                            ...i,
                            quantity: Math.max(
                              1,
                              Math.min(
                                99999,
                                Math.trunc(Number(e.target.value) || 1),
                              ),
                            ),
                          }
                        : i,
                    ),
                  )
                }
              />
            </label>
            <button
              type="button"
              onClick={() => update(items.filter((i) => i.id !== line.id))}
              aria-label={"Remove " + lineTitle(line)}
            >
              REMOVE ×
            </button>
          </div>
          <label className="field line-specifications">
            <span>LINE SPECIFICATIONS</span>
            <textarea
              aria-label={"Specifications for " + lineTitle(line)}
              rows={3}
              maxLength={1000}
              value={line.specifications}
              onChange={(e) =>
                update(
                  items.map((i) =>
                    i.id === line.id
                      ? { ...i, specifications: e.target.value }
                      : i,
                  ),
                )
              }
            />
          </label>
        </div>
      ))}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <p className="basket-note">
        Every line is an enquiry. Compatibility, availability, jurisdiction and
        buyer eligibility require review.
      </p>
      <Link className="text-link" href="/equipment-package/">
        BUILD AN EQUIPMENT PACKAGE ↗
      </Link>
      {items.length > 0 && (
        <button className="text-button" onClick={() => update([])}>
          CLEAR EQUIPMENT LIST
        </button>
      )}
    </aside>
  );
}
