"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, CalendarDays, Check, CheckCircle2, ChevronDown, Clock3, Download, Eye, Filter, HeartHandshake, MoreHorizontal, Package, Plus, Search, Shapes, ShoppingCart, SlidersHorizontal, Sparkles, TrendingUp, Truck, Users, X } from "lucide-react";
import { formatCurrency } from "../../data/products";
import { useAdminData, type AdminCampaign, type AdminCategory, type AdminOrder, type AdminProduct } from "./AdminData";
import styles from "./Admin.module.css";

type Section = "dashboard" | "products" | "inventory" | "orders" | "customers" | "categories" | "reports" | "content" | "campaigns" | "settings";
const samplePreviewOrders: AdminOrder[] = [
  { id: "SAMPLE-1048", customer: "Aarohi Deshmukh", total: 2450, createdAt: "2026-10-16T10:30:00.000Z", status: "Processing", paymentMethod: "UPI" },
  { id: "SAMPLE-1047", customer: "Kabir Patil", total: 1890, createdAt: "2026-09-22T09:10:00.000Z", status: "Delivered", paymentMethod: "Card" },
  { id: "SAMPLE-1046", customer: "Meera Joshi", total: 3250, createdAt: "2026-08-14T12:45:00.000Z", status: "Shipped", paymentMethod: "UPI" },
  { id: "SAMPLE-1045", customer: "Ishan Kulkarni", total: 1460, createdAt: "2026-07-08T08:15:00.000Z", status: "Delivered", paymentMethod: "Cash on delivery" },
  { id: "SAMPLE-1044", customer: "Sana Shaikh", total: 2780, createdAt: "2026-06-19T11:20:00.000Z", status: "Delivered", paymentMethod: "Card" },
];
const titles: Record<Section, { eyebrow: string; title: string; description: string }> = {
  dashboard: { eyebrow: "WORKSPACE OVERVIEW", title: "Your foundation at a glance", description: "A current view of the products and orders saved in this browser." },
  products: { eyebrow: "YOUR CATALOG", title: "Products", description: "Manage your collection, pricing and product visibility." },
  inventory: { eyebrow: "STOCK CONTROL", title: "Inventory", description: "Review available stock and update quantities." },
  orders: { eyebrow: "STORE ACTIVITY", title: "Orders", description: "Review locally stored orders and update their status." },
  customers: { eyebrow: "YOUR COMMUNITY", title: "Customers", description: "Customers are listed here when an order is recorded in this browser." },
  categories: { eyebrow: "COLLECTION ORGANIZATION", title: "Categories", description: "Arrange products into collections that are easy to browse." },
  reports: { eyebrow: "PERFORMANCE", title: "Reports & insights", description: "Sales totals are calculated from the orders available in this browser." },
  content: { eyebrow: "STOREFRONT EDITOR", title: "Website content", description: "Edit the headline and introduction used in this workspace." },
  campaigns: { eyebrow: "COMMUNITY PROGRAMS", title: "Campaigns & programs", description: "Manage foundation initiatives and community stories." },
  settings: { eyebrow: "WORKSPACE PREFERENCES", title: "Settings", description: "Update organization details saved in this browser." },
};

export default function AdminWorkspace({ section, initialProductDialog = false }: { section: Section; initialProductDialog?: boolean }) {
  const router = useRouter();
  const data = useAdminData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [stockFilter, setStockFilter] = useState("All stock levels");
  const [sort, setSort] = useState("name");
  const [advancedFilters, setAdvancedFilters] = useState(false);
  const [quickActions, setQuickActions] = useState(false);
  const [productDialog, setProductDialog] = useState(initialProductDialog);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [toast, setToast] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [campaignArea, setCampaignArea] = useState("Community wellbeing");
  const [campaignStatus, setCampaignStatus] = useState<AdminCampaign["status"]>("Active");
  const [contentTitle, setContentTitle] = useState(data.content.title);
  const [contentDescription, setContentDescription] = useState(data.content.description);
  const [settingsDraft, setSettingsDraft] = useState(data.settings);
  useEffect(() => { if (initialProductDialog) setProductDialog(true); }, [initialProductDialog]);
  useEffect(() => {
    if (!data.ready) return;
    setContentTitle(data.content.title);
    setContentDescription(data.content.description);
    setSettingsDraft(data.settings);
  }, [data.ready, data.content, data.settings]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const page = titles[section];
  const visibleProducts = useMemo(() => {
    const filtered = data.products.filter((product) => {
      const textMatch = `${product.name} ${product.category} ${product.sku}`.toLowerCase().includes(search.toLowerCase());
      const statusMatch = statusFilter === "All statuses" || product.status === statusFilter;
      const categoryMatch = categoryFilter === "All categories" || product.category === categoryFilter;
      const stockMatch = stockFilter === "All stock levels" || (stockFilter === "Low stock" ? product.stock > 0 && product.stock < 10 : stockFilter === "Out of stock" ? product.stock === 0 : product.stock >= 10);
      return textMatch && statusMatch && categoryMatch && stockMatch;
    });
    return filtered.sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "stock-low" ? a.stock - b.stock : a.name.localeCompare(b.name));
  }, [data.products, search, statusFilter, categoryFilter, stockFilter, sort]);
  const orderRecords = useMemo(() => data.orders.length ? data.orders : samplePreviewOrders.map((order) => ({ ...order, status: data.orderStatuses[order.id] ?? order.status })), [data.orders, data.orderStatuses]);
  const visibleOrders = useMemo(() => orderRecords.filter((order) => `${order.id} ${order.customer}`.toLowerCase().includes(search.toLowerCase()) && (statusFilter === "All statuses" || order.status === statusFilter)), [orderRecords, search, statusFilter]);

  const saveProduct = (product: Omit<AdminProduct, "id" | "slug"> & { id?: string; slug?: string }) => {
    const duplicateSku = data.products.some((item) => item.sku.trim().toLowerCase() === product.sku.trim().toLowerCase() && item.id !== product.id);
    if (duplicateSku) { notify("That SKU is already used by another product."); return false; }
    const slug = product.slug || product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const next: AdminProduct = { ...product, id: product.id || `admin-${createLocalId()}`, slug, status: product.status ?? "Published" };
    data.setProducts((current) => product.id ? current.map((item) => item.id === product.id ? next : item) : [next, ...current]);
    setProductDialog(false); setEditingProduct(null); notify(product.id ? "Product changes saved." : "Product added to the catalog.");
    if (initialProductDialog) router.replace("/admin/products");
    return true;
  };
  const closeProductDialog = () => { setProductDialog(false); setEditingProduct(null); if (initialProductDialog) router.replace("/admin/products"); };
  const updateStock = (id: string, adjustment: number) => data.setProducts((current) => current.map((product) => product.id === id ? { ...product, stock: Math.max(0, product.stock + adjustment) } : product));
  const saveCategory = (name: string, description: string, subcategories: string[]) => {
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (data.categories.some((category) => category.slug === slug && category.slug !== editingCategory?.slug)) { notify("A collection with that name already exists."); return false; }
    const next: AdminCategory = { slug, name, description, subcategories };
    data.setCategories((current) => editingCategory ? current.map((category) => category.slug === editingCategory.slug ? next : category) : [...current, next]);
    setCategoryDialog(false); setEditingCategory(null); notify("Collection saved.");
    return true;
  };
  const addCampaign = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!campaignName.trim()) return;
    data.setCampaigns((current) => [{ id: crypto.randomUUID(), name: campaignName.trim(), area: campaignArea, status: campaignStatus }, ...current]);
    setCampaignName(""); notify("Program saved.");
  };
  const applyContent = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); data.setContent({ title: contentTitle.trim(), description: contentDescription.trim() }); notify("Website copy saved in this browser."); };
  const applySettings = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); data.setSettings(settingsDraft); notify("Organization details saved in this browser."); };

  return <div className={styles.workspace}>
    <div className={styles.pageHeading}><div><span className={styles.eyebrow}>{page.eyebrow}</span><h1>{page.title}</h1><p>{page.description}</p></div><div className={styles.headingActions}>
      {section === "dashboard" && <button type="button" className={styles.secondaryButton} onClick={() => { const sample = data.orders.length === 0; const ok = exportOrders(orderRecords, sample); notify(ok ? (sample ? "Preview sample orders downloaded." : "Orders downloaded successfully.") : "Could not download the orders file."); }}><Download size={15} /> Export orders</button>}
      {section === "inventory" && <button type="button" className={`${styles.secondaryButton} ${advancedFilters ? styles.filterActive : ""}`} aria-expanded={advancedFilters} onClick={() => setAdvancedFilters((value) => !value)}><SlidersHorizontal size={15} /> More filters</button>}
      {section === "products" && <Link href="/admin/products/new" className={`${styles.primaryButton} ${styles.addProductButton}`}><Plus size={16} /> Add product</Link>}
      {section === "categories" && <button type="button" className={styles.primaryButton} aria-haspopup="dialog" aria-controls="category-dialog" onClick={() => { setEditingCategory(null); setCategoryDialog(true); }}><Plus size={16} /> Add collection</button>}
      {section === "campaigns" && <a className={styles.secondaryButton} href="#new-program"><Plus size={15} /> New program</a>}
    </div></div>

    {section === "dashboard" && <>{data.ready && data.orders.length === 0 && <div className={styles.demoBanner}><span><Sparkles size={14} /> SAMPLE DATA</span><p>Preview orders help explain this dashboard. They are examples only and are not saved as real sales.</p></div>}<Dashboard products={data.products} orders={data.orders.length ? data.orders : samplePreviewOrders} isPreview={!data.orders.length} onQuick={() => setQuickActions((value) => !value)} quickOpen={quickActions} /></>}
    {section === "products" && <ProductSection products={visibleProducts} categories={data.categories} search={search} onSearch={setSearch} category={categoryFilter} onCategory={setCategoryFilter} status={statusFilter} onStatus={setStatusFilter} sort={sort} onSort={setSort} onEdit={(product) => { setEditingProduct(product); setProductDialog(true); }} onDelete={(product) => { if (window.confirm(`Delete ${product.name}?`)) { data.setProducts((current) => current.filter((item) => item.id !== product.id)); notify("Product removed."); } }} />}
    {section === "inventory" && <InventorySection products={visibleProducts} categories={data.categories} search={search} onSearch={setSearch} category={categoryFilter} onCategory={setCategoryFilter} stock={stockFilter} onStock={setStockFilter} sort={sort} onSort={setSort} advanced={advancedFilters} onAdjust={updateStock} />}
    {section === "orders" && <>{data.ready && data.orders.length === 0 && <div className={styles.demoBanner}><span><Sparkles size={14} /> SAMPLE ORDERS</span><p>These example orders are for preview only. They are not real purchases and are not saved as store orders.</p></div>}<OrdersSection orders={visibleOrders} isPreview={!data.orders.length} search={search} onSearch={setSearch} status={statusFilter} onStatusFilter={setStatusFilter} onStatus={(id, status) => data.setOrderStatus(id, status)} onExport={() => exportOrders(orderRecords)} /></>}
    {section === "customers" && <>{data.ready && data.orders.length === 0 && <div className={styles.demoBanner}><span><Sparkles size={14} /> SAMPLE CUSTOMERS</span><p>Example customer records are shown for preview and are not real purchases.</p></div>}<CustomersSection orders={data.orders.length ? data.orders : samplePreviewOrders} isPreview={!data.orders.length} search={search} onSearch={setSearch} /></>}
    {section === "categories" && <CategoriesSection categories={data.categories} products={data.products} onEdit={(category) => { setEditingCategory(category); setCategoryDialog(true); }} onDelete={(category) => { if (window.confirm(`Delete ${category.name}? Products in this collection will remain in the catalog.`)) { data.setCategories((current) => current.filter((item) => item.slug !== category.slug)); notify("Collection removed."); } }} />}
    {section === "reports" && <ReportsSection products={data.products} orders={data.orders} />}
    {section === "content" && <ContentSection title={contentTitle} description={contentDescription} onTitle={setContentTitle} onDescription={setContentDescription} onSubmit={applyContent} />}
    {section === "campaigns" && <CampaignSection campaigns={data.campaigns} name={campaignName} onName={setCampaignName} area={campaignArea} onArea={setCampaignArea} status={campaignStatus} onStatus={setCampaignStatus} onSubmit={addCampaign} onDelete={(id) => data.setCampaigns((current) => current.filter((campaign) => campaign.id !== id))} onUpdate={(id, status) => data.setCampaigns((current) => current.map((campaign) => campaign.id === id ? { ...campaign, status } : campaign))} />}
    {section === "settings" && <SettingsSection value={settingsDraft} onChange={setSettingsDraft} onSubmit={applySettings} />}

    <div className={styles.storageNote} role="note"><span className={styles.storageNoteIcon}><CheckCircle2 size={14} /></span><span className={styles.storageNoteCopy}><strong>Saved locally</strong><small>Changes stay in this browser and are not sent to a server.</small></span></div>
    {toast && <div className={styles.toast} role="status"><span><Check size={16} /></span>{toast}<button type="button" onClick={() => setToast("")} aria-label="Dismiss notification"><X size={15} /></button></div>}
    {productDialog && <ProductDialog product={editingProduct} categories={data.categories} onClose={closeProductDialog} returnToProducts={initialProductDialog} onSave={saveProduct} />}
    {categoryDialog && <CategoryDialog category={editingCategory} onClose={() => { setCategoryDialog(false); setEditingCategory(null); }} onSave={saveCategory} />}
  </div>;
}

function Dashboard({ products, orders, isPreview, onQuick, quickOpen }: { products: AdminProduct[]; orders: AdminOrder[]; isPreview: boolean; onQuick: () => void; quickOpen: boolean }) {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const customers = new Set(orders.map((order) => order.customer.trim().toLowerCase()).filter(Boolean)).size;
  const average = orders.length ? Math.round(revenue / orders.length) : 0;
  const lowStock = products.filter((product) => product.stock > 0 && product.stock < 10);
  const months = useMemo(() => monthSeries(orders), [orders]);
  const maxRevenue = Math.max(1, ...months.map((month) => month.total));
  const delivered = orders.filter((order) => order.status === "Delivered").length;
  const pending = orders.filter((order) => order.status === "Pending" || order.status === "Processing").length;
  const shipped = orders.filter((order) => order.status === "Shipped").length;
  const totalOrders = orders.length;
  const fulfillmentStatuses = [
    { label: "Delivered", description: "Successfully completed", value: delivered, icon: CheckCircle2, className: styles.fulfillmentDelivered },
    { label: "In progress", description: "Processing and pending", value: pending, icon: Clock3, className: styles.fulfillmentPending },
    { label: "Shipped", description: "On the way", value: shipped, icon: Truck, className: styles.fulfillmentShipped },
  ];
  const metricData = [
    { label: isPreview ? "Sample revenue" : "Recorded revenue", value: formatCurrency(revenue), delta: isPreview ? "Preview only ? not real sales" : `${orders.length} recorded orders`, icon: TrendingUp, tint: "purple" },
    { label: "Orders", value: String(orders.length), delta: isPreview ? "Sample records for preview" : `${pending} need attention`, icon: Package, tint: "peach" },
    { label: "Customers", value: String(customers), delta: isPreview ? "Example customer records" : "Based on recorded orders", icon: Users, tint: "blue" },
    { label: isPreview ? "Sample average" : "Average order", value: formatCurrency(average), delta: isPreview ? "Example value only" : "Calculated from recorded orders", icon: ShoppingCart, tint: "green" },
  ];
  return <>
    <section className={styles.metrics}>{metricData.map(({ label, value, delta, icon: Icon, tint }) => <article className={styles.metricCard} key={label}><div className={styles.metricTop}><span>{label}</span><span className={`${styles.metricIcon} ${styles[tint]}`}><Icon size={17} /></span></div><div className={styles.metricValue}>{value}</div><div className={styles.metricFoot}>{delta}</div></article>)}</section>
    <div className={styles.dashboardGrid}>
      <section className={`${styles.panel} ${styles.revenuePanel}`}><div className={styles.panelHeading}><div><span className={styles.eyebrow}>{isPreview ? "SAMPLE ORDER DATA" : "ORDER RECORDS"}</span><h2>Revenue by month</h2></div><span className={styles.dataSource}><CalendarDays size={13} /> {isPreview ? "Preview sample" : "Last 6 months"}</span></div><div className={styles.chartSummary}><strong>{formatCurrency(revenue)}</strong><span>{orders.length} orders</span></div><div className={styles.chart}><div className={styles.chartLabels}><span>{formatCurrency(maxRevenue)}</span><span>{formatCurrency(maxRevenue * .75)}</span><span>{formatCurrency(maxRevenue * .5)}</span><span>{formatCurrency(maxRevenue * .25)}</span><span>₹ 0</span></div><div className={styles.chartPlot}><div className={styles.chartGuides}><i /><i /><i /><i /><i /></div><div className={styles.liveBars}>{months.map((month) => { const barHeight = month.total ? Math.max(4, (month.total / maxRevenue) * 78) : 0; return <div className={styles.liveBarColumn} key={month.label} title={`${month.label}: ${formatCurrency(month.total)}`}><strong className={styles.liveBarValue} style={{ bottom: `calc(${barHeight}% + 4px)` }}>{formatCurrency(month.total)}</strong><span style={{ height: `${barHeight}%` }} /><small>{month.label}</small></div>; })}</div></div></div><p className={styles.chartNote}><span className={styles.chartNoteDot} /><strong>{isPreview ? "Preview data" : "Recorded data"}</strong><span>{isPreview ? "Sample amounts are shown for layout preview only; they are not real sales." : "Amounts are calculated from orders saved in this browser."}</span></p></section>
      <section className={`${styles.panel} ${styles.orderPanel}`} aria-labelledby="order-status-heading">
        <div className={styles.panelHeading}>
          <div><span className={styles.eyebrow}>FULFILMENT</span><h2 id="order-status-heading">Order status</h2></div>
          <span className={styles.fulfillmentTotal}>{totalOrders} total</span>
        </div>
        <div className={styles.fulfillmentSummary}>
          <div className={styles.fulfillmentSummaryText}><span>Order distribution</span><strong>{totalOrders ? `${totalOrders} orders` : "No orders yet"}</strong></div>
          <div className={styles.fulfillmentTrack} role="img" aria-label={`${delivered} delivered, ${pending} in progress, ${shipped} shipped`}>
            <span className={styles.fulfillmentDelivered} style={{ width: `${totalOrders ? (delivered / totalOrders) * 100 : 0}%` }} />
            <span className={styles.fulfillmentPending} style={{ width: `${totalOrders ? (pending / totalOrders) * 100 : 0}%` }} />
            <span className={styles.fulfillmentShipped} style={{ width: `${totalOrders ? (shipped / totalOrders) * 100 : 0}%` }} />
          </div>
        </div>
        <div className={styles.fulfillmentList}>{fulfillmentStatuses.map(({ label, description, value, icon: Icon, className }) => <article className={styles.fulfillmentItem} key={label}>
          <span className={`${styles.fulfillmentIcon} ${className}`}><Icon size={16} /></span>
          <span className={styles.fulfillmentCopy}><strong>{label}</strong><small>{description}</small></span>
          <strong className={styles.fulfillmentCount}>{value}</strong>
        </article>)}</div>
      </section>
      <section className={`${styles.panel} ${styles.recentPanel}`}><div className={styles.panelHeading}><div><span className={styles.eyebrow}>{isPreview ? "SAMPLE RECORDS" : "LATEST RECORDS"}</span><h2>Recent orders</h2></div><Link href="/admin/orders">View orders <ArrowUpRight size={14} /></Link></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE</th><th>STATUS</th><th className={styles.alignRight}>TOTAL</th></tr></thead><tbody>{[...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5).map((order) => <tr key={order.id}><td><strong className={styles.orderId}>{order.id}</strong></td><td><span className={styles.customerName}>{order.customer}</span></td><td>{formatDate(order.createdAt)}</td><td><StatusBadge status={order.status} /></td><td className={styles.alignRight}><strong>{formatCurrency(order.total)}</strong></td></tr>)}</tbody></table></div></section>
      <section className={`${styles.panel} ${styles.quickPanel}`}>
        <div className={styles.panelHeading}>
          <div><span className={styles.eyebrow}>QUICK ACCESS</span><h2>What would you like to do?</h2><p>Jump straight to a common workspace task.</p></div>
          <button type="button" className={styles.iconButton} aria-expanded={quickOpen} aria-controls="quick-action-menu" aria-label={quickOpen ? "Close quick actions" : "Open quick actions"} onClick={onQuick}><MoreHorizontal size={18} /></button>
        </div>
        <div className={styles.quickLinks}>
          <Link href="/admin/products/new" className={styles.quickLink}><span className={`${styles.quickIcon} ${styles.quickIconPurple}`}><Package size={17} /></span><span><strong>Add a product</strong><small>Create or update a catalog item</small></span><span className={styles.quickArrow}><ArrowUpRight size={15} /></span></Link>
          <Link href="/admin/inventory" className={styles.quickLink}><span className={`${styles.quickIcon} ${styles.quickPeach}`}><SlidersHorizontal size={17} /></span><span><strong>Review inventory</strong><small>{lowStock.length} low stock {lowStock.length === 1 ? "item" : "items"} to review</small></span><span className={styles.quickArrow}><ArrowUpRight size={15} /></span></Link>
          <Link href="/admin/content" className={styles.quickLink}><span className={`${styles.quickIcon} ${styles.quickBlue}`}><HeartHandshake size={17} /></span><span><strong>Update your story</strong><small>Edit the website introduction</small></span><span className={styles.quickArrow}><ArrowUpRight size={15} /></span></Link>
        </div>
        {quickOpen && <div id="quick-action-menu" className={styles.quickActionMenu}><span className={styles.quickMenuLabel}>MORE WORKSPACE ACTIONS</span><Link href="/admin/products/new"><Plus size={14} /> Create product</Link><Link href="/admin/orders"><Package size={14} /> Review orders</Link><Link href="/admin/reports"><Download size={14} /> View reports</Link></div>}
        {lowStock.length > 0 && <Link href="/admin/inventory" className={styles.impactNote}><span className={styles.impactIcon}><Sparkles size={16} /></span><span className={styles.impactCopy}><span className={styles.impactTitle}><strong>Stock needs review</strong><b>{lowStock.length} {lowStock.length === 1 ? "product" : "products"}</b></span><small title={lowStock.map((product) => product.name).join(", ")}>{lowStock.map((product) => product.name).slice(0, 2).join(", ")}{lowStock.length > 2 ? ` +${lowStock.length - 2} more` : ""}</small></span><span className={styles.impactAction}>Review <ArrowUpRight size={13} /></span></Link>}
      </section>
    </div>
  </>;
}
function ProductSection({ products, categories, search, onSearch, category, onCategory, status, onStatus, sort, onSort, onEdit, onDelete }: { products: AdminProduct[]; categories: AdminCategory[]; search: string; onSearch: (value: string) => void; category: string; onCategory: (value: string) => void; status: string; onStatus: (value: string) => void; sort: string; onSort: (value: string) => void; onEdit: (product: AdminProduct) => void; onDelete: (product: AdminProduct) => void }) {
  return <><div className={styles.statStrip}><div><span>Products</span><strong>{products.length}</strong></div><div><span>Published</span><strong>{products.filter((item) => item.status === "Published").length}</strong></div><div><span>Low stock</span><strong className={styles.warningText}>{products.filter((item) => item.stock > 0 && item.stock < 10).length}</strong></div><div><span>Out of stock</span><strong>{products.filter((item) => item.stock === 0).length}</strong></div></div><section className={styles.panel}><div className={styles.tableToolbar}><div className={styles.tableSearch}><Search size={16} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search product, collection or SKU..." /></div><div className={styles.toolbarActions}><select className={styles.filterSelect} value={category} onChange={(event) => onCategory(event.target.value)}><option>All categories</option>{categories.map((item) => <option key={item.slug}>{item.name}</option>)}</select><select className={styles.filterSelect} value={status} onChange={(event) => onStatus(event.target.value)}><option>All statuses</option><option>Published</option><option>Draft</option></select><select className={styles.filterSelect} value={sort} onChange={(event) => onSort(event.target.value)}><option value="name">Name</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="stock-low">Lowest stock</option></select></div></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>SKU</th><th>PRICE</th><th>STOCK</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{products.map((item, index) => <tr key={item.id}><td><div className={styles.productCell}><span className={`${styles.productThumb} ${styles[`thumb${index % 4}`]}`}><Package size={17} /></span><span><strong>{item.name}</strong><small className={styles.tableSub}>{item.slug}</small></span></div></td><td>
  <div><strong>{item.category}</strong></div>
  {item.subcategory && <small style={{ color: "#806d89", fontSize: "11px", display: "inline-block", background: "#f5f0f7", padding: "1px 6px", borderRadius: "8px", marginTop: "2px" }}>{item.subcategory}</small>}
</td><td className={styles.sku}>{item.sku}</td><td><strong>{formatCurrency(item.price)}</strong></td><td><span className={`${styles.stockValue} ${item.stock < 10 ? styles.stockLow : ""}`}><i />{item.stock}</span></td><td><StatusBadge status={item.status} /></td><td><div className={styles.rowActions}><button type="button" className={styles.iconButton} onClick={() => onEdit(item)} aria-label={`Edit ${item.name}`}><Eye size={15} /></button><button type="button" className={styles.iconButton} onClick={() => onDelete(item)} aria-label={`Delete ${item.name}`}><X size={15} /></button></div></td></tr>)}</tbody></table>{products.length === 0 && <EmptyState title="No matching products" body="Adjust your search or filters, or add a product." />}</div><div className={styles.tableFooter}>Showing <strong>{products.length}</strong> products</div></section></>;
}

function InventorySection({ products, categories, search, onSearch, category, onCategory, stock, onStock, sort, onSort, advanced, onAdjust }: { products: AdminProduct[]; categories: AdminCategory[]; search: string; onSearch: (value: string) => void; category: string; onCategory: (value: string) => void; stock: string; onStock: (value: string) => void; sort: string; onSort: (value: string) => void; advanced: boolean; onAdjust: (id: string, amount: number) => void }) {
  const units = products.reduce((sum, product) => sum + product.stock, 0);
  return <><div className={styles.statStrip}><div><span>Product lines</span><strong>{products.length}</strong></div><div><span>Units in stock</span><strong>{units}</strong></div><div><span>Low stock</span><strong className={styles.warningText}>{products.filter((item) => item.stock > 0 && item.stock < 10).length}</strong></div><div><span>Out of stock</span><strong>{products.filter((item) => item.stock === 0).length}</strong></div></div><section className={styles.panel}><div className={styles.tableToolbar}><div className={styles.tableSearch}><Search size={16} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search by product or SKU..." /></div><div className={styles.toolbarActions}><select className={styles.filterSelect} value={stock} onChange={(event) => onStock(event.target.value)}><option>All stock levels</option><option>Low stock</option><option>Out of stock</option><option>In stock</option></select><button type="button" className={styles.secondaryButton} onClick={() => exportProducts(products)}><Download size={15} /> Export</button></div></div>{advanced && <div className={styles.advancedFilters}><div><span className={styles.eyebrow}>FILTER INVENTORY</span><p>Refine by collection and stock availability.</p></div><label>Collection<select className={styles.filterSelect} value={category} onChange={(event) => onCategory(event.target.value)}><option>All categories</option>{categories.map((item) => <option key={item.slug}>{item.name}</option>)}</select></label><label>Sort by<select className={styles.filterSelect} value={sort} onChange={(event) => onSort(event.target.value)}><option value="stock-low">Lowest stock first</option><option value="name">Product name</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label><button type="button" className={styles.clearFilters} onClick={() => { onCategory("All categories"); onStock("All stock levels"); onSort("stock-low"); onSearch(""); }}>Clear filters</button></div>}<div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>SKU</th><th>PRICE</th><th>AVAILABLE</th><th>ADJUST STOCK</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className={styles.productCell}><span className={styles.productThumb}><Package size={17} /></span><span><strong>{product.name}</strong><small className={styles.tableSub}>{product.status}</small></span></div></td><td>{product.category}</td><td className={styles.sku}>{product.sku}</td><td>{formatCurrency(product.price)}</td><td><span className={`${styles.stockValue} ${product.stock < 10 ? styles.stockLow : ""}`}><i />{product.stock} units</span></td><td><div className={styles.stockAdjust}><button type="button" onClick={() => onAdjust(product.id, -1)} aria-label={`Remove one ${product.name}`} disabled={product.stock === 0}>−</button><strong>{product.stock}</strong><button type="button" onClick={() => onAdjust(product.id, 1)} aria-label={`Add one ${product.name}`}>+</button></div></td></tr>)}</tbody></table>{products.length === 0 && <EmptyState title="No matching products" body="Change your filters to see inventory." />}</div></section></>;
}

function OrdersSection({ orders, isPreview, search, onSearch, status, onStatusFilter, onStatus, onExport }: { orders: AdminOrder[]; isPreview: boolean; search: string; onSearch: (value: string) => void; status: string; onStatusFilter: (value: string) => void; onStatus: (id: string, status: AdminOrder["status"]) => void; onExport: () => void }) {
  return <><div className={styles.statStrip}><div><span>{isPreview ? "Sample orders" : "Orders on this browser"}</span><strong>{orders.length}</strong></div><div><span>Pending</span><strong>{orders.filter((item) => item.status === "Pending").length}</strong></div><div><span>Processing</span><strong>{orders.filter((item) => item.status === "Processing").length}</strong></div><div><span>Delivered</span><strong>{orders.filter((item) => item.status === "Delivered").length}</strong></div></div><section className={styles.panel}><div className={styles.tableToolbar}><div className={styles.tableSearch}><Search size={16} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search order reference or customer..." /></div><div className={styles.toolbarActions}><select className={styles.filterSelect} value={status} onChange={(event) => onStatusFilter(event.target.value)}><option>All statuses</option><option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option></select><button type="button" className={styles.secondaryButton} onClick={onExport}><Download size={15} /> {isPreview ? "Export sample" : "Export"}</button></div></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE</th><th>PAYMENT</th><th>STATUS</th><th className={styles.alignRight}>TOTAL</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong className={styles.orderId}>{order.id}</strong></td><td><span className={styles.customerName}>{order.customer}</span></td><td>{formatDate(order.createdAt)}</td><td>{order.paymentMethod || "Not recorded"}</td><td><select className={`${styles.statusSelect} ${styles[`status${order.status}`]}`} value={order.status} onChange={(event) => onStatus(order.id, event.target.value as AdminOrder["status"])} aria-label={`Status for ${order.id}`}><option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option></select></td><td className={styles.alignRight}><strong>{formatCurrency(order.total)}</strong></td></tr>)}</tbody></table>{orders.length === 0 && <EmptyState title="No matching orders" body="Change the search or status filter to see orders." />}</div></section></>;
}
function CustomersSection({ orders, isPreview, search, onSearch }: { orders: AdminOrder[]; isPreview: boolean; search: string; onSearch: (value: string) => void }) {
  const rows = useMemo(() => {
    const grouped = new Map<string, { name: string; count: number; total: number; firstDate: string }>();
    orders.forEach((order) => { const key = order.customer.trim().toLowerCase(); if (!key) return; const current = grouped.get(key); if (current) { current.count += 1; current.total += order.total; if (order.createdAt < current.firstDate) current.firstDate = order.createdAt; } else grouped.set(key, { name: order.customer, count: 1, total: order.total, firstDate: order.createdAt }); });
    return [...grouped.values()].filter((customer) => customer.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => b.total - a.total);
  }, [orders, search]);
  return <section className={styles.panel}><div className={styles.tableToolbar}><div className={styles.tableSearch}><Search size={16} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search customer name..." /></div><span className={styles.statusPill}>{isPreview ? "Sample data · " : ""}{rows.length} customers</span></div><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>CUSTOMER</th><th>{isPreview ? "SAMPLE ORDERS" : "RECORDED ORDERS"}</th><th>ORDER TOTAL</th><th>FIRST ORDER</th></tr></thead><tbody>{rows.map((customer) => <tr key={customer.name}><td><div className={styles.productCell}><span className={styles.avatar}>{customer.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><span><strong>{customer.name}</strong><small className={styles.tableSub}>{isPreview ? "Example customer · no contact details" : "Contact details were not included with the order record"}</small></span></div></td><td>{customer.count}</td><td><strong>{formatCurrency(customer.total)}</strong></td><td>{formatDate(customer.firstDate)}</td></tr>)}</tbody></table></div>{rows.length === 0 && <EmptyState title="No matching customers" body="Change your search to see customer records." />}</section>;
}

function CategoriesSection({ categories, products, onEdit, onDelete }: { categories: AdminCategory[]; products: AdminProduct[]; onEdit: (category: AdminCategory) => void; onDelete: (category: AdminCategory) => void }) {
  return categories.length ? <div className={styles.categoryGrid}>{categories.map((category, index) => {
    const subs = Array.isArray(category.subcategories) ? category.subcategories : (category.subcategories ? String(category.subcategories).split(",").map((s) => s.trim()).filter(Boolean) : []);
    return <article className={styles.categoryCard} key={category.slug}>
      <div className={`${styles.categoryArt} ${styles[`categoryArt${index % 3}`]}`}>
        <span>0{index + 1}</span>
        <Shapes size={32} strokeWidth={1.2} />
      </div>
      <div className={styles.categoryInfo}>
        <div>
          <span className={styles.statusPill}><i /> Available</span>
          <button type="button" className={styles.iconButton} aria-label={`Delete ${category.name}`} onClick={() => onDelete(category)}><X size={16} /></button>
        </div>
        <h2>{category.name}</h2>
        <p>{category.description}</p>
        {subs.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "10px 0" }}>
            {subs.map((sub) => (
              <span key={sub} style={{ fontSize: "11px", background: "rgba(128, 109, 137, 0.12)", color: "#54435b", padding: "3px 8px", borderRadius: "12px", fontWeight: 500 }}>
                {sub}
              </span>
            ))}
          </div>
        )}
        <footer>
          <span>{products.filter((product) => product.category === category.name).length} products</span>
          <button type="button" onClick={() => onEdit(category)}>Edit collection <ArrowUpRight size={14} /></button>
        </footer>
      </div>
    </article>;
  })}</div> : <EmptyState title="No collections yet" body="Add a collection to organize products." />;
}

function ReportsSection({ products, orders }: { products: AdminProduct[]; orders: AdminOrder[] }) {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const units = products.reduce((sum, product) => sum + product.stock, 0);
  const months = monthSeries(orders);
  const max = Math.max(1, ...months.map((month) => month.total));
  return <><div className={styles.reportToolbar}><span><CalendarDays size={15} /> Calculated from locally stored orders</span><button className={styles.secondaryButton} type="button" onClick={() => exportOrders(orders)}><Download size={15} /> Download orders</button></div><div className={styles.metrics}>{[{ label: "Recorded revenue", value: formatCurrency(revenue), icon: TrendingUp, tint: "purple" }, { label: "Orders", value: String(orders.length), icon: ShoppingCart, tint: "peach" }, { label: "Products", value: String(products.length), icon: Package, tint: "blue" }, { label: "Units in stock", value: String(units), icon: Users, tint: "green" }].map(({ label, value, icon: Icon, tint }) => <article className={styles.metricCard} key={label}><div className={styles.metricTop}><span>{label}</span><span className={`${styles.metricIcon} ${styles[tint]}`}><Icon size={17} /></span></div><div className={styles.metricValue}>{value}</div><div className={styles.metricFoot}>Current browser records</div></article>)}</div><section className={`${styles.panel} ${styles.reportChartPanel}`}><div className={styles.panelHeading}><div><span className={styles.eyebrow}>MONTHLY TOTALS</span><h2>Revenue by month</h2></div></div><div className={styles.reportBars}>{months.map((month) => <div key={month.label} title={`${month.label}: ${formatCurrency(month.total)}`}><span style={{ height: `${month.total ? Math.max(4, (month.total / max) * 100) : 0}%` }} /><small>{month.label}</small></div>)}</div>{orders.length === 0 && <p className={styles.noRecords}>The chart will populate as order records are added.</p>}</section></>;
}

function ContentSection({ title, description, onTitle, onDescription, onSubmit }: { title: string; description: string; onTitle: (value: string) => void; onDescription: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className={styles.contentEditorGrid}><section className={styles.panel}><div className={styles.panelHeading}><div><span className={styles.eyebrow}>HOMEPAGE</span><h2>Hero section</h2></div></div><form className={styles.editorForm} onSubmit={onSubmit}><label>Headline<input value={title} onChange={(event) => onTitle(event.target.value)} required /></label><label>Supporting text<textarea rows={4} value={description} onChange={(event) => onDescription(event.target.value)} required /></label><div className={styles.modalActions}><button className={styles.primaryButton} type="submit">Save content <Check size={15} /></button></div></form></section><aside className={styles.previewCard}><span className={styles.eyebrow}>CONTENT PREVIEW</span><div className={styles.previewHero}><span>SWACHETNA FOUNDATION</span><h2>{title}</h2><p>{description}</p><span className={styles.previewAction}>Explore our work <ArrowUpRight size={13} /></span></div><div className={styles.previewFoot}><span><i /> Updated in this browser</span></div></aside></div>;
}

function CampaignSection({ campaigns, name, onName, area, onArea, status, onStatus, onSubmit, onDelete, onUpdate }: { campaigns: AdminCampaign[]; name: string; onName: (value: string) => void; area: string; onArea: (value: string) => void; status: AdminCampaign["status"]; onStatus: (value: AdminCampaign["status"]) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onDelete: (id: string) => void; onUpdate: (id: string, status: AdminCampaign["status"]) => void }) {
  return <><section className={styles.panel}><div className={styles.panelHeading}><div><span className={styles.eyebrow}>FOUNDATION PROGRAMS</span><h2>Your initiatives</h2></div><span className={styles.statusPill}>{campaigns.length} programs</span></div>{campaigns.length ? <div className={styles.programList}>{campaigns.map((campaign) => <article className={styles.programRow} key={campaign.id}><span className={styles.programThumb}><HeartHandshake size={20} /></span><div><span className={styles.programTag}>{campaign.area}</span><h3>{campaign.name}</h3></div><select className={styles.filterSelect} value={campaign.status} onChange={(event) => onUpdate(campaign.id, event.target.value as AdminCampaign["status"])} aria-label={`Status of ${campaign.name}`}><option>Active</option><option>Draft</option></select><button type="button" className={styles.iconButton} aria-label={`Remove ${campaign.name}`} onClick={() => onDelete(campaign.id)}><X size={16} /></button></article>)}</div> : <EmptyState title="No programs added" body="Add a foundation initiative below to keep it in this workspace." />}</section><section id="new-program" className={styles.panel}><div className={styles.panelHeading}><div><span className={styles.eyebrow}>CREATE</span><h2>New community program</h2></div></div><form className={styles.inlineForm} onSubmit={onSubmit}><label>Program name<input value={name} onChange={(event) => onName(event.target.value)} placeholder="Name of initiative" required /></label><label>Program area<select value={area} onChange={(event) => onArea(event.target.value)}><option>Community wellbeing</option><option>Education</option><option>Health</option><option>Skills &amp; livelihoods</option><option>Food security</option></select></label><label>Status<select value={status} onChange={(event) => onStatus(event.target.value as AdminCampaign["status"])}><option>Active</option><option>Draft</option></select></label><button className={styles.primaryButton} type="submit"><Plus size={15} /> Save program</button></form></section></>;
}

function SettingsSection({ value, onChange, onSubmit }: { value: { organization: string; email: string; phone: string; website: string; address: string }; onChange: (value: { organization: string; email: string; phone: string; website: string; address: string }) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const update = (key: keyof typeof value, field: string) => onChange({ ...value, [key]: field });
  return <div className={styles.settingsGrid}>
    <aside className={styles.settingsAside}>
      <span className={styles.settingsBrandIcon}><HeartHandshake size={22} /></span>
      <span className={styles.eyebrow}>FOUNDATION PROFILE</span>
      <h2>{value.organization || "Your organization"}</h2>
      <p>{value.website || "Add your website address"}</p>
      <div className={styles.settingsStatus}><i /> Workspace profile</div>
      <div className={styles.settingsAsideFoot}><strong>Saved in this browser</strong><small>These details are local to this device and are not published to the website.</small></div>
    </aside>
    <section className={`${styles.panel} ${styles.settingsPanel}`}>
      <div className={styles.panelHeading}><div><span className={styles.eyebrow}>ORGANIZATION</span><h2>Profile details</h2><p>Keep your contact information current for this workspace.</p></div><span className={styles.settingsBadge}>LOCAL PROFILE</span></div>
      <form className={styles.settingsForm} onSubmit={onSubmit}>
        <div className={styles.formRow}><label>Organization name<input autoComplete="organization" value={value.organization} onChange={(event) => update("organization", event.target.value)} required /></label><label>Contact email<input autoComplete="email" type="email" value={value.email} onChange={(event) => update("email", event.target.value)} /></label></div>
        <div className={styles.formRow}><label>Phone number<input autoComplete="tel" type="tel" value={value.phone} onChange={(event) => update("phone", event.target.value)} /></label><label>Website<input type="url" value={value.website} onChange={(event) => update("website", event.target.value)} placeholder="https://example.org" /></label></div>
        <label>Address<textarea autoComplete="street-address" rows={3} value={value.address} onChange={(event) => update("address", event.target.value)} /></label>
        <div className={styles.settingsSaveRow}><span><Check size={14} /> Saved only after you press Save</span><button type="submit" className={styles.primaryButton}>Save organization details <Check size={15} /></button></div>
      </form>
    </section>
  </div>;
}
function ProductDialog({ product, categories, onClose, onSave, returnToProducts }: { product: AdminProduct | null; categories: AdminCategory[]; onClose: () => void; onSave: (product: Omit<AdminProduct, "id" | "slug"> & { id?: string; slug?: string }) => boolean; returnToProducts: boolean }) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState(product?.category ?? categories[0]?.name ?? "Uncategorized");
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [status, setStatus] = useState<AdminProduct["status"]>(product?.status ?? "Published");
  const [error, setError] = useState("");

  const activeCategoryObj = categories.find((c) => c.name === category);
  const availableSubcategories: string[] = useMemo(() => {
    if (!activeCategoryObj?.subcategories) return [];
    if (Array.isArray(activeCategoryObj.subcategories)) return activeCategoryObj.subcategories;
    return String(activeCategoryObj.subcategories).split(",").map((s) => s.trim()).filter(Boolean);
  }, [activeCategoryObj]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = name.trim();
    const normalizedSku = sku.trim() || `SW-${Date.now().toString().slice(-6)}`;
    if (!normalizedName || !Number.isFinite(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      setError("Add a product name, a valid price, and a whole-number stock quantity.");
      return;
    }
    const saved = onSave({ id: product?.id, slug: product?.slug, name: normalizedName, description: description.trim(), category, subcategory, sku: normalizedSku, price: Number(price), stock: Number(stock), status });
    if (!saved) setError("This SKU is already in use. Choose a different SKU.");
  };
  const closeControl = (className: string, label: string, child: ReactNode) => returnToProducts
    ? <Link href="/admin/products" className={className} aria-label={label}>{child}</Link>
    : <button type="button" className={className} onClick={onClose} aria-label={label}>{child}</button>;
  return <div className={styles.modalScrim} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section id="product-dialog" className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="product-dialog-title"><div className={styles.modalHead}><div><span className={styles.eyebrow}>PRODUCT CATALOG</span><h2 id="product-dialog-title">{product ? "Edit product" : "Add product"}</h2><p>Add the product details, description, price and available quantity.</p></div>{closeControl(styles.iconButton, "Close product form", <X size={18} />)}</div><form className={styles.modalForm} onSubmit={submit}>
    <label>Product name<input autoFocus autoComplete="off" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Handcrafted Mango Pickle / Dryfruit Laddu" required maxLength={100} /></label>
    <label>Product description<textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the product, ingredients, materials or what makes it special..." maxLength={1200} /></label>
    <div className={styles.formRow}>
      <label>Main Collection<select value={category} onChange={(event) => { setCategory(event.target.value); setSubcategory(""); }}>{categories.length ? categories.map((item) => <option key={item.slug} value={item.name}>{item.name}</option>) : <option>Uncategorized</option>}</select></label>
      <label>Sub-collection {availableSubcategories.length > 0 ? <small className={styles.formHint}>(Select sub-category)</small> : <small className={styles.formHint}>(Optional)</small>}
        {availableSubcategories.length > 0 ? (
          <select value={subcategory} onChange={(event) => setSubcategory(event.target.value)}>
            <option value="">-- Select Sub-collection --</option>
            {availableSubcategories.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        ) : (
          <input value={subcategory} onChange={(event) => setSubcategory(event.target.value)} placeholder="e.g. Pickle, Laddu, Papad" maxLength={60} />
        )}
      </label>
    </div>
    <div className={styles.formRow}><label>Price (INR)<input inputMode="decimal" min="0" step="0.01" type="number" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0.00" required /></label><label>Stock quantity<input inputMode="numeric" min="0" step="1" type="number" value={stock} onChange={(event) => setStock(event.target.value)} placeholder="0" required /></label></div>
    <div className={styles.formRow}><label>SKU <small className={styles.formHint}>Unique product code</small><input value={sku} onChange={(event) => { setSku(event.target.value); setError(""); }} placeholder="Generated if blank" maxLength={40} /></label><label>Visibility<select value={status} onChange={(event) => setStatus(event.target.value as AdminProduct["status"])}><option>Published</option><option>Draft</option></select></label></div>
    {error && <p className={styles.formError} role="alert">{error}</p>}
    <div className={styles.modalActions}>{returnToProducts ? <Link href="/admin/products" className={styles.secondaryButton}>Cancel</Link> : <button type="button" className={styles.secondaryButton} onClick={onClose}>Cancel</button>}<button className={styles.primaryButton} type="submit">{product ? "Save changes" : "Add product"} <Check size={15} /></button></div>
  </form></section></div>;
}
function CategoryDialog({ category, onClose, onSave }: { category: AdminCategory | null; onClose: () => void; onSave: (name: string, description: string, subcategories: string[]) => boolean }) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [subcategoriesText, setSubcategoriesText] = useState(
    Array.isArray(category?.subcategories) 
      ? category.subcategories.join(", ") 
      : (category?.subcategories || "")
  );
  const [error, setError] = useState("");
  return <div className={styles.modalScrim} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section id="category-dialog" className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="category-dialog-title"><div className={styles.modalHead}><div><span className={styles.eyebrow}>COLLECTIONS</span><h2 id="category-dialog-title">{category ? "Edit collection" : "Add collection"}</h2><p>Give your product collection a clear name, description and sub-collections.</p></div><button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close"><X size={18} /></button></div><form className={styles.modalForm} onSubmit={(event) => { 
    event.preventDefault(); 
    const subs = subcategoriesText.split(",").map((s) => s.trim()).filter(Boolean);
    if (!onSave(name.trim(), description.trim(), subs)) setError("A collection with this name already exists."); 
  }}><label>Collection name<input autoFocus value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="e.g. Food & NGO Products" required maxLength={80} /></label><label>Description<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description of this collection..." required maxLength={240} /></label><label>Sub-collections <small className={styles.formHint}>(Separate by comma, e.g. Pickle, Dryfruit Laddu, Papad)</small><input value={subcategoriesText} onChange={(event) => setSubcategoriesText(event.target.value)} placeholder="Pickle, Dryfruit Laddu, Papad, Spices" maxLength={300} /></label>{error && <p className={styles.formError} role="alert">{error}</p>}<div className={styles.modalActions}><button type="button" className={styles.secondaryButton} onClick={onClose}>Cancel</button><button type="submit" className={styles.primaryButton}>{category ? "Save changes" : "Add collection"} <Check size={15} /></button></div></form></section></div>;
}

function StatusBadge({ status }: { status: string }) { const kind = status.toLowerCase().replaceAll(" ", ""); return <span className={`${styles.statusPill} ${styles[`status${kind}`] ?? ""}`}><i />{status}</span>; }
function EmptyState({ title, body }: { title: string; body: string }) { return <div className={styles.emptyTable}><span><Search size={19} /></span><strong>{title}</strong><p>{body}</p></div>; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date); }
function createLocalId() { try { if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID(); } catch { /* Some local network origins do not expose randomUUID. */ } return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`; }
function monthSeries(orders: AdminOrder[]) { const now = new Date(); return Array.from({ length: 6 }, (_, index) => { const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1); const label = new Intl.DateTimeFormat("en-IN", { month: "short" }).format(date); const total = orders.filter((order) => { const created = new Date(order.createdAt); return created.getFullYear() === date.getFullYear() && created.getMonth() === date.getMonth(); }).reduce((sum, order) => sum + order.total, 0); return { label, total }; }); }
function exportOrders(orders: AdminOrder[], sample = false) { const rows = [[sample ? "Sample order (preview only)" : "Order", "Customer", "Date", "Status", "Total (INR)"], ...orders.map((order) => [order.id, order.customer, formatDate(order.createdAt), order.status, order.total.toFixed(2)])]; return downloadCsv(sample ? "sample-orders-preview.csv" : "orders.csv", rows); }
function exportProducts(products: AdminProduct[]) { const rows = [["Product", "Collection", "SKU", "Price", "Stock", "Visibility"], ...products.map((product) => [product.name, product.category, product.sku, String(product.price), String(product.stock), product.status])]; downloadCsv("inventory.csv", rows); }
function downloadCsv(filename: string, rows: string[][]) { try { const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n")}`; const blob = new Blob([csv], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.style.position = "fixed"; anchor.style.left = "-9999px"; document.body.appendChild(anchor); anchor.click(); window.setTimeout(() => { anchor.remove(); URL.revokeObjectURL(url); }, 5000); return true; } catch { return false; } }
