"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories, products } from "../../../data/products";
import ProductGrid from "../ProductGrid/ProductGrid";
import EmptyState from "../../ui/EmptyState/EmptyState";
import styles from "./CatalogBrowser.module.css";

export default function CatalogBrowser({ mode = "shop", initialQuery = "" }: { mode?: "shop" | "search"; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const [minimum, setMinimum] = useState("");
  const [maximum, setMaximum] = useState("");
  const [sort, setSort] = useState("featured");
  const [limit, setLimit] = useState(6);
  const [mobileFilters, setMobileFilters] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = products.filter((product) => {
      const searchableText = `${product.name} ${product.category} ${product.shortDescription} ${product.description}`.toLowerCase();
      return searchableText.includes(term)
        && (category === "All" || product.category === category)
        && (!minimum || product.price >= Number(minimum))
        && (!maximum || product.price <= Number(maximum));
    });
    return [...list].sort((a, b) => sort === "price-low"
      ? a.price - b.price
      : sort === "price-high"
        ? b.price - a.price
        : sort === "name"
          ? a.name.localeCompare(b.name)
          : a.featuredRank - b.featuredRank);
  }, [query, category, minimum, maximum, sort]);

  const reset = () => {
    setQuery("");
    setCategory("All");
    setMinimum("");
    setMaximum("");
    setSort("featured");
    setLimit(6);
  };
  const setCategoryFilter = (value: string) => {
    setCategory(value);
    setLimit(6);
  };
  const filters = <>
    <label className={styles.label}>
      <span>Search</span>
      <span className={styles.searchInput}>
        <input value={query} onChange={(event) => { setQuery(event.target.value); setLimit(6); }} placeholder="Search products..." />
        <Search size={17} aria-hidden="true" />
      </span>
    </label>
    <fieldset>
      <legend>Collections</legend>
      <button type="button" className={category === "All" ? styles.selected : ""} aria-pressed={category === "All"} onClick={() => setCategoryFilter("All")}>
        All products <span>{products.length}</span>
      </button>
      {categories.map((item) => <button type="button" key={item.slug} className={category === item.name ? styles.selected : ""} aria-pressed={category === item.name} onClick={() => setCategoryFilter(item.name)}>
        {item.name}<span>{item.count}</span>
      </button>)}
    </fieldset>
    <fieldset>
      <legend>Price range</legend>
      <div className={styles.prices}>
        <label>Minimum<input type="number" min="0" inputMode="numeric" value={minimum} onChange={(event) => { setMinimum(event.target.value); setLimit(6); }} placeholder="INR 0" /></label>
        <label>Maximum<input type="number" min="0" inputMode="numeric" value={maximum} onChange={(event) => { setMaximum(event.target.value); setLimit(6); }} placeholder="INR 5,000" /></label>
      </div>
    </fieldset>
  </>;

  const active = category !== "All" || Boolean(minimum || maximum || query);
  return <>
    <div className={styles.toolbar}>
      <div className={styles.resultCount} aria-live="polite"><span className={styles.count}>{filtered.length}</span> thoughtful {filtered.length === 1 ? "find" : "finds"}</div>
      <div className={styles.tools}>
        <button type="button" className={styles.mobileFilter} aria-expanded={mobileFilters} aria-controls="catalog-filters" onClick={() => setMobileFilters((open) => !open)}><SlidersHorizontal size={16} />{mobileFilters ? "Hide filters" : "Filters"}</button>
        <label>Sort by<select value={sort} onChange={(event) => { setSort(event.target.value); setLimit(6); }}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label>
      </div>
    </div>
    {active && <div className={styles.active} aria-label="Active filters"><span>Active filters</span>{category !== "All" && <button type="button" onClick={() => setCategoryFilter("All")}>{category}<X size={13} /></button>}{query && <button type="button" onClick={() => { setQuery(""); setLimit(6); }}>“{query}”<X size={13} /></button>}{(minimum || maximum) && <button type="button" onClick={() => { setMinimum(""); setMaximum(""); setLimit(6); }}>Price<X size={13} /></button>}<button type="button" className={styles.clear} onClick={reset}>Clear all</button></div>}
    <div className={`${styles.layout} ${mobileFilters ? styles.filtersOpen : ""}`}>
      <aside id="catalog-filters" className={styles.sidebar} aria-label="Product filters">
        <div className={styles.sidebarHead}>Filter <button type="button" onClick={() => setMobileFilters(false)} aria-label="Close filters"><X size={17} /></button></div>
        {filters}
      </aside>
      <div className={styles.results} aria-busy="false">
        {filtered.length ? <>
          <ProductGrid products={filtered.slice(0, limit)} showBuyNow />
          {filtered.length > limit && <button type="button" className={styles.loadMore} onClick={() => setLimit((current) => Math.min(current + 4, filtered.length))}>View more products <span>({filtered.length - limit} remaining)</span></button>}
        </> : <EmptyState title="No products found" description="Try another search or change your filters." action={<button type="button" className={styles.reset} onClick={reset}>View all products</button>} />}
      </div>
    </div>
  </>;
}
