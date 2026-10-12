"use client";
import { useId, useState } from "react";
import Link from "@/components/site-link";
import { categories, publishedProducts } from "@/lib/catalog";
import { categoryApplications } from "@/lib/categories";
import {
  defaultFilters,
  filterProducts,
  type CatalogFilters,
} from "@/lib/catalog-search";
import { ProductCard } from "./product-components";
export default function CatalogueBrowser({
  initialCategory = "",
}: {
  initialCategory?: string;
}) {
  const id = useId();
  const [filters, setFilters] = useState<CatalogFilters>({
    ...defaultFilters,
    category: initialCategory,
  });
  const [limit, setLimit] = useState(6);
  const update = (key: keyof CatalogFilters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setLimit(6);
  };
  const populated = publishedProducts.length > 0;
  const results = filterProducts(publishedProducts, filters);
  const sourcing = categories
    .filter(
      (c) =>
        (!filters.category || c.slug === filters.category) &&
        (!filters.application ||
          categoryApplications[c.slug].includes(filters.application)) &&
        filters.query
          .toLowerCase()
          .split(/\s+/)
          .every((term) =>
            [c.title, c.summary, ...c.items]
              .join(" ")
              .toLowerCase()
              .includes(term),
          ),
    )
    .sort((a, b) =>
      filters.sort === "title-asc"
        ? a.title.localeCompare(b.title)
        : filters.sort === "title-desc"
          ? b.title.localeCompare(a.title)
          : 0,
    );
  const applications = [
    ...new Set(
      populated
        ? publishedProducts.flatMap((p) => p.applications)
        : Object.values(categoryApplications).flat(),
    ),
  ];
  const suppliers = [
    ...new Map(
      publishedProducts.map((p) => [p.supplier.id, p.supplier]),
    ).values(),
  ];
  const features = [...new Set(publishedProducts.flatMap((p) => p.features))];
  const count = populated ? results.length : sourcing.length;
  const select = (
    key: keyof CatalogFilters,
    label: string,
    options: { value: string; label: string }[],
  ) => (
    <label className="field">
      <span>{label}</span>
      <select
        value={filters[key]}
        onChange={(e) => update(key, e.target.value)}
      >
        <option value="">All {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <section className="catalogue" aria-labelledby={id}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">SPECIFY YOUR EQUIPMENT</p>
          <h2 id={id}>
            {populated
              ? "Equipment catalogue"
              : "Find your equipment requirements"}
          </h2>
        </div>
        <p>
          {populated
            ? "Search verified specifications and contact our team about a product."
            : "Browse sourcing categories. Exact products, supplier availability and compatibility are confirmed in conversation with our team."}
        </p>
      </div>
      <div className="catalogue-layout">
        <div className="catalogue-filters">
          <label className="field">
            <span>SEARCH EQUIPMENT</span>
            <input
              type="search"
              value={filters.query}
              onChange={(e) => update("query", e.target.value)}
              placeholder="Trap, trailer, signage…"
            />
          </label>
          {select(
            "category",
            "CATEGORY",
            categories.map((c) => ({ value: c.slug, label: c.short })),
          )}
          {select(
            "application",
            "APPLICATION",
            applications.map((a) => ({ value: a, label: a })),
          )}
          {populated && (
            <>
              {select(
                "supplier",
                "SUPPLIER",
                suppliers.map((s) => ({ value: s.id, label: s.name })),
              )}
              {select(
                "feature",
                "FEATURE",
                features.map((s) => ({ value: s, label: s })),
              )}
              <label className="field">
                <span>MAXIMUM WIDTH (MM)</span>
                <input
                  type="number"
                  min="1"
                  value={filters.maxWidthMm}
                  onChange={(e) => update("maxWidthMm", e.target.value)}
                />
              </label>
            </>
          )}
          <label className="field">
            <span>SORT RESULTS</span>
            <select
              value={filters.sort}
              onChange={(e) => update("sort", e.target.value)}
            >
              <option value="relevance">Recommended order</option>
              <option value="title-asc">Name: A–Z</option>
              <option value="title-desc">Name: Z–A</option>
            </select>
          </label>
          <button
            className="text-button"
            onClick={() => {
              setFilters({ ...defaultFilters, category: initialCategory });
              setLimit(6);
            }}
          >
            RESET FILTERS
          </button>
        </div>
        <div>
          <p role="status" aria-live="polite">
            {count} {populated ? "products" : "sourcing categories"} found
          </p>
          {count === 0 && (
            <div className="empty-results">
              <h3>Describe what you need.</h3>
              <p>
                No matches for these filters. Adjust your search or contact our
                team about your sourcing requirements.
              </p>
              <Link className="button amber" href="/contact/">
                CONTACT US ↗
              </Link>
            </div>
          )}
          <div className="product-grid">
            {populated
              ? results
                  .slice(0, limit)
                  .map((p) => <ProductCard key={p.id} product={p} />)
              : sourcing.slice(0, limit).map((c) => (
                  <article className="product-card" key={c.slug}>
                    <p className="eyebrow">SOURCING CATEGORY / {c.number}</p>
                    <h3>
                      <Link href={"/" + c.slug + "/"}>{c.title}</Link>
                    </h3>
                    <p>{c.summary}</p>
                    <ul>
                      {c.items.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                    <Link className="text-link" href={"/" + c.slug + "/"}>
                      SPECIFY REQUIREMENTS ↗
                    </Link>
                  </article>
                ))}
          </div>
          {count > limit && (
            <button
              className="button amber"
              onClick={() => setLimit((n) => n + 6)}
            >
              SHOW MORE RESULTS ↓
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
