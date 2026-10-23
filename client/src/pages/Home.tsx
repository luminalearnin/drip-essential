import { useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Heart, Instagram, Mail, Menu, Minus, Plus, Search, ShieldCheck, ShoppingBag, Sparkles, Truck, X } from "lucide-react";
import { toast } from "sonner";
import { brands, bestsellerIds, products, type Product } from "@/data/catalog";
import { useStore } from "@/store";

const WHATSAPP = "919137722174";
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP}`;
const INSTAGRAM = "https://www.instagram.com/dripx_watches?utm_source=qr";
const EMAIL = "dripessential62@gmail.com";
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const fallbackImage = asset("assets/IMG_2394.webp");

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function imageWithFallback(event: React.SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.src.endsWith(fallbackImage)) return;
  image.src = fallbackImage;
}

function makeWhatsAppUrl(message: string) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

function Logo() {
  return (
    <Link href="/" className="brand-lockup" aria-label="Drip Essential home">
      <span className="brand-mark"><span>DE</span></span>
      <span className="brand-copy"><strong>DRIP ESSENTIAL</strong><small>TIME, WITH A POINT OF VIEW</small></span>
    </Link>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const { bagCount, setBagOpen } = useStore();

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(query.trim() ? `/watches?search=${encodeURIComponent(query.trim())}` : "/watches");
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="topline"><span>CURATED TIMEPIECES · CONSIDERED DETAILS · PERSONAL SERVICE</span><a href={makeWhatsAppUrl("Hi Drip Essential, I would like help choosing a watch.")} target="_blank" rel="noreferrer">CHAT WITH A CONCIERGE <ArrowRight size={13} /></a></div>
      <header className="site-header">
        <button className="icon-button mobile-only" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={21} strokeWidth={1.6} /></button>
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/watches">The collection</Link>
          <Link href="/watches?best=1">Bestsellers</Link>
          <Link href="/about">Our point of view</Link>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen((value) => !value)}><Search size={19} strokeWidth={1.6} /></button>
          <button className="bag-button" aria-label={`Open bag, ${bagCount} items`} onClick={() => setBagOpen(true)}><ShoppingBag size={19} strokeWidth={1.6} /><span className="bag-number">{bagCount}</span></button>
        </div>
      </header>
      {searchOpen && <div className="search-panel"><form onSubmit={submitSearch}><Search size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, brand or collection" /><button type="submit">Search</button><button type="button" className="close-search" onClick={() => setSearchOpen(false)}><X size={18} /></button></form></div>}
      {menuOpen && <div className="mobile-menu"><div className="mobile-menu-head"><Logo /><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={22} /></button></div><nav><Link href="/watches" onClick={() => setMenuOpen(false)}>The collection <ArrowRight size={18} /></Link><Link href="/watches?best=1" onClick={() => setMenuOpen(false)}>Bestsellers <ArrowRight size={18} /></Link><Link href="/about" onClick={() => setMenuOpen(false)}>Our point of view <ArrowRight size={18} /></Link><a href={makeWhatsAppUrl("Hi Drip Essential, I would like a private watch recommendation.")} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Private concierge <ArrowRight size={18} /></a></nav><div className="mobile-menu-foot"><span>Free shipping on prepaid orders</span><span>6 months warranty</span></div></div>}
    </>
  );
}

function Footer() {
  return <footer className="footer">
    <div className="footer-main">
      <div className="footer-brand"><Logo /><p>Luxury-inspired timepieces, thoughtfully chosen and personally packed from India.</p><div className="social-row"><a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} strokeWidth={1.6} /></a><a href={`mailto:${EMAIL}`} aria-label="Email"><Mail size={18} strokeWidth={1.6} /></a><a href={WHATSAPP_BASE} target="_blank" rel="noreferrer" aria-label="WhatsApp"><span className="wa-glyph">wa</span></a></div></div>
      <div><h4>Explore</h4><Link href="/watches">All watches</Link><Link href="/watches?best=1">Bestsellers</Link><Link href="/about">About us</Link></div>
      <div><h4>Support</h4><Link href="/shipping">Shipping info</Link><Link href="/returns">Returns</Link><a href={makeWhatsAppUrl("Hi Drip Essential, I have a question about an order.")} target="_blank" rel="noreferrer">Ask a question</a></div>
      <div><h4>Get in touch</h4><a href={`mailto:${EMAIL}`}>{EMAIL}</a><a href={WHATSAPP_BASE} target="_blank" rel="noreferrer">+91 91377 22174</a><a href={INSTAGRAM} target="_blank" rel="noreferrer">@dripx_watches</a></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Drip Essential</span><span>Visa · Mastercard · UPI · COD</span><span>Made for moments that stay with you.</span></div>
  </footer>;
}

function TrustStrip() {
  const items = [[Truck, "Free shipping", "on prepaid orders"], [ShieldCheck, "6 months warranty", "quality you can trust"], [Sparkles, "Safety packaging", "carefully packed"], [Heart, "Human support", "before and after you buy"]] as const;
  return <section className="trust-strip">{items.map(([Icon, title, copy]) => <div className="trust-item" key={title}><Icon size={21} strokeWidth={1.4} /><div><strong>{title}</strong><span>{copy}</span></div></div>)}</section>;
}

function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addToBag } = useStore();
  return <article className={`product-card ${compact ? "compact" : ""}`}>
    <Link href={`/product/${product.id}`} className="product-image-wrap">
      {product.bestseller && <span className="product-badge">Bestseller</span>}
      <button className="heart-button" aria-label={`Save ${product.name}`} onClick={(event) => { event.preventDefault(); toast.success("Saved for later"); }}><Heart size={17} strokeWidth={1.5} /></button>
      <img src={product.image || fallbackImage} alt={product.name} loading="lazy" onError={imageWithFallback} />
      <span className="view-hover">View piece <ArrowRight size={15} /></span>
    </Link>
    <div className="product-meta"><span className="product-brand">{product.brand}</span><Link href={`/product/${product.id}`} className="product-name">{product.name}</Link><div className="product-bottom"><span className="product-price">{money(product.price)}</span><button className="add-button" onClick={() => { addToBag(product); toast.success("Added to your bag"); }}><Plus size={15} /> Add</button></div></div>
  </article>;
}

function HomeHero() {
  return <section className="hero container-wide">
    <div className="hero-copy">
      <span className="eyebrow">THE PRIVATE COLLECTION · VOLUME 01</span>
      <h1>Time, with<br /><em>a point of view.</em></h1>
      <p>Luxury silhouettes. Considered details. A more personal way to wear the world’s most wanted names.</p>
      <div className="hero-actions"><Link href="/watches" className="button button-dark">Explore the collection <ArrowRight size={16} /></Link><a href={makeWhatsAppUrl("Hi Drip Essential, I would like a private watch recommendation.")} className="text-link" target="_blank" rel="noreferrer">Talk to a concierge <ArrowRight size={15} /></a></div>
      <div className="hero-note"><span className="note-line" /><span>Curated in India<br /><small>For the ones who notice.</small></span></div>
    </div>
    <div className="hero-art"><img src={asset("assets/frontpage.webp")} alt="A sculptural Longines watch editorial for Drip Essential" /><div className="hero-art-tint" /><div className="hero-card"><span>THE EDIT / 01</span><strong>Signature<br />dials</strong><Link href="/watches?search=Omega">Shop the edit <ArrowRight size={15} /></Link></div><div className="hero-stamp">DRIP<br /><b>ESSENTIAL</b><span>✦</span></div></div>
  </section>;
}

function BrandRail() {
  const featuredBrands = brands.slice(0, 8);
  return <section className="brand-section"><div className="section-heading centered"><span className="eyebrow">A WORLD OF WATCHMAKING</span><h2>Names worth<br /><em>knowing by heart.</em></h2><p>From everyday icons to collector favourites, find the piece that feels unmistakably yours.</p></div><div className="brand-featured">{featuredBrands.map((brand, index) => <Link href={`/watches/${slugify(brand.name)}`} className="brand-featured-card" key={brand.name}><span className="brand-card-number">0{index + 1}</span><div className="brand-logo-stage">{brand.logo ? <img src={asset(brand.logo)} alt={`${brand.name} logo`} loading="lazy" onError={imageWithFallback} /> : <strong>{brand.name}</strong>}</div><div className="brand-card-footer"><strong>{brand.name}</strong><span>Explore <ArrowRight size={13} /></span></div></Link>)}</div><div className="brand-index-heading"><span>THE FULL INDEX</span><small>{brands.length} names · one considered collection</small></div><div className="brand-grid">{brands.map((brand) => <Link href={`/watches/${slugify(brand.name)}`} className="brand-tile" key={brand.name}>{brand.logo ? <img src={asset(brand.logo)} alt={brand.name} loading="lazy" onError={imageWithFallback} /> : <span>{brand.name}</span>}<small>{brand.name}</small><span className="brand-count">{products.filter((product) => product.brand === brand.name).length} pieces</span></Link>)}</div><div className="center-action"><Link href="/watches" className="text-link">Browse all {brands.length} brands <ArrowRight size={15} /></Link></div></section>;
}

function Home() {
  const bestsellers = bestsellerIds.map((id) => products.find((product) => product.id === id)).filter(Boolean) as Product[];
  const featured = bestsellers.length ? bestsellers : products.slice(0, 8);
  return <div className="site-shell"><Header /><main><HomeHero /><TrustStrip /><section className="story container-wide"><div className="story-image"><img src={asset("assets/IMG_2394.webp")} alt="Cartier watch from the Drip Essential collection" /><span className="image-caption">A considered collection / Since 2024</span></div><div className="story-copy"><span className="eyebrow">THE DRIP ESSENTIAL POINT OF VIEW</span><h2>Good taste is<br /><em>in the details.</em></h2><p>We believe a watch does more than tell time. It gives a day its rhythm, a look its finishing note, a moment a little more meaning.</p><p>So we curate timepieces with presence, pack them with care, and stay close whenever you need us — before, during, and long after the purchase.</p><Link href="/about" className="text-link">Read our story <ArrowRight size={15} /></Link><div className="story-signature"><span>DE</span><div><b>Curated for you</b><small>Not mass-produced. Never forgettable.</small></div></div></div></section><section className="featured-section container-wide"><div className="section-heading row-heading"><div><span className="eyebrow">THE MOST LOVED PIECES</span><h2>In good company.</h2></div><Link href="/watches?best=1" className="text-link">View all bestsellers <ArrowRight size={15} /></Link></div><div className="product-grid featured-grid">{featured.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div></section><BrandRail /><section className="concierge-band"><div className="concierge-copy"><span className="eyebrow">NEED A SECOND OPINION?</span><h2>Some pieces are<br /><em>better chosen together.</em></h2><p>Tell us what you’re looking for, who it’s for, and the feeling you want it to carry. We’ll make a considered recommendation.</p><a href={makeWhatsAppUrl("Hi Drip Essential, I would like help finding the right watch.")} className="button button-light" target="_blank" rel="noreferrer">Start a private conversation <ArrowRight size={16} /></a></div><div className="concierge-orbit"><div className="orbit-ring" /><div className="orbit-watch"><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span><b>DE</b></div></div></section></main><Footer /><BagDrawer /></div>;
}

function CatalogToolbar({ search, setSearch, onlyBest, setOnlyBest, sort, setSort, selectedBrand, setSelectedBrand }: { search: string; setSearch: (value: string) => void; onlyBest: boolean; setOnlyBest: (value: boolean) => void; sort: string; setSort: (value: string) => void; selectedBrand: string; setSelectedBrand: (value: string) => void }) {
  return <div className="catalog-toolbar"><div className="catalog-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or brand" /></div><div className="catalog-controls"><select value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)} aria-label="Filter by brand"><option value="">All brands</option>{brands.map((brand) => <option value={brand.name} key={brand.name}>{brand.name}</option>)}</select><button className={`filter-chip ${onlyBest ? "selected" : ""}`} onClick={() => setOnlyBest(!onlyBest)}><Sparkles size={14} /> Bestsellers</button><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort collection"><option value="featured">Sort: Featured</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option><option value="az">Name: A to Z</option></select></div></div>;
}

export function CatalogPage() {
  const [, brandParams] = useRoute<{ brand: string }>("/watches/:brand");
  const [location, navigate] = useLocation();
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initialBrand = brandParams?.brand ? decodeURIComponent(brandParams.brand).replace(/-/g, " ").toUpperCase() : "";
  const [search, setSearch] = useState(params.get("search") || "");
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [onlyBest, setOnlyBest] = useState(params.get("best") === "1");
  const [sort, setSort] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(24);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = products.filter((product) => {
      const matchesQuery = !query || `${product.name} ${product.brand} ${product.description}`.toLowerCase().includes(query);
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const matchesBest = !onlyBest || product.bestseller;
      return matchesQuery && matchesBrand && matchesBest;
    });
    return [...list].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "az" ? a.name.localeCompare(b.name) : Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)));
  }, [onlyBest, search, selectedBrand, sort]);

  const changeBrand = (value: string) => {
    setSelectedBrand(value);
    setVisibleCount(24);
    if (value && location.split("?")[0] !== `/watches/${slugify(value)}`) navigate(`/watches/${slugify(value)}`);
    if (!value && location.split("?")[0] !== "/watches") navigate("/watches");
  };

  const title = selectedBrand ? selectedBrand : onlyBest ? "The best of Drip Essential" : "The collection";
  const intro = selectedBrand ? `A considered edit of ${selectedBrand} timepieces.` : onlyBest ? "The pieces our community keeps coming back to." : "671 timepieces, 32 names, and plenty of ways to make an entrance.";
  return <div className="site-shell"><Header /><main><section className="catalog-intro container-wide"><div><span className="eyebrow">THE DRIP ESSENTIAL ARCHIVE</span><h1>{title}</h1><p>{intro}</p></div><div className="catalog-count"><span>{filtered.length}</span><small>pieces to explore</small></div></section><div className="container-wide"><CatalogToolbar search={search} setSearch={(value) => { setSearch(value); setVisibleCount(24); }} onlyBest={onlyBest} setOnlyBest={(value) => { setOnlyBest(value); setVisibleCount(24); }} sort={sort} setSort={setSort} selectedBrand={selectedBrand} setSelectedBrand={changeBrand} /></div><section className="catalog-layout container-wide"><aside className="catalog-aside"><span className="eyebrow">FILTER BY BRAND</span><div className="brand-filter-list"><button className={!selectedBrand ? "active" : ""} onClick={() => changeBrand("")}>All watches <small>{products.length}</small></button>{brands.map((brand) => <button className={selectedBrand === brand.name ? "active" : ""} key={brand.name} onClick={() => changeBrand(brand.name)}>{brand.name}<small>{products.filter((product) => product.brand === brand.name).length}</small></button>)}</div></aside><div className="catalog-results"><div className="results-top"><span>{search || selectedBrand || onlyBest ? "Curated results" : "Showing the archive"}</span><span>01 — {Math.min(visibleCount, filtered.length).toString().padStart(2, "0")} of {filtered.length}</span></div>{filtered.length ? <><div className="product-grid">{filtered.slice(0, visibleCount).map((product) => <ProductCard key={product.id} product={product} />)}</div>{visibleCount < filtered.length && <div className="load-more"><button className="button button-outline" onClick={() => setVisibleCount((count) => count + 24)}>Load more pieces <ChevronDown size={16} /></button></div>}</> : <div className="empty-state"><Sparkles size={28} /><h3>No exact match, yet.</h3><p>Try a brand, a model name, or ask our concierge for a considered alternative.</p><a href={makeWhatsAppUrl(`Hi Drip Essential, I am looking for ${search || selectedBrand || "a watch"}.`)} className="button button-dark" target="_blank" rel="noreferrer">Ask the concierge <ArrowRight size={16} /></a></div>}</div></section></main><Footer /><BagDrawer /></div>;
}

export function ProductPage() {
  const [, params] = useRoute<{ id: string }>("/product/:id");
  const product = products.find((item) => item.id === params?.id);
  const { addToBag } = useStore();
  const [activeImage, setActiveImage] = useState(product?.image || fallbackImage);
  if (!product) return <div className="site-shell"><Header /><div className="empty-state page-empty"><Sparkles size={28} /><h3>This piece has moved on.</h3><Link className="button button-dark" href="/watches">Return to the collection <ArrowRight size={16} /></Link></div><Footer /></div>;
  const inquiry = makeWhatsAppUrl(`Hi Drip Essential, I am interested in purchasing this watch:\nBrand: ${product.brand}\nModel: ${product.name}\nPrice: ${money(product.price)}\nProduct link: ${typeof window !== "undefined" ? window.location.href : ""}`);
  const related = products.filter((item) => item.brand === product.brand && item.id !== product.id).slice(0, 4);
  return <div className="site-shell"><Header /><main><div className="breadcrumbs container-wide"><Link href="/">Home</Link><ChevronRight size={14} /><Link href={`/watches/${slugify(product.brand)}`}>{product.brand}</Link><ChevronRight size={14} /><span>{product.name}</span></div><section className="product-detail container-wide"><div className="detail-gallery"><div className="detail-thumbs">{[...new Set([product.image, ...product.images])].slice(0, 4).map((image, index) => <button key={image} className={activeImage === image ? "active" : ""} onClick={() => setActiveImage(image)}><img src={image || fallbackImage} alt={`${product.name} view ${index + 1}`} onError={imageWithFallback} /></button>)}</div><div className="detail-image"><img src={activeImage || fallbackImage} alt={product.name} onError={imageWithFallback} /><span className="detail-stamp">DRIP<br />ESSENTIAL</span></div></div><div className="detail-copy"><span className="product-brand">{product.brand}</span><h1>{product.name}</h1><div className="detail-price">{money(product.price)} <span>inclusive</span></div><div className={`stock-note ${product.stock > 0 ? "in-stock" : "sold-out"}`}><span />{product.stock > 0 ? `In stock · ${product.stock} available` : "Currently unavailable"}</div><p className="detail-description">{product.description} A distinctive timepiece, selected for its presence and made to be worn often.</p><div className="detail-actions"><button className="button button-dark" disabled={!product.stock} onClick={() => { addToBag(product); toast.success("Added to your bag"); }}>Add to bag <ShoppingBag size={16} /></button><a className="button button-whatsapp" href={inquiry} target="_blank" rel="noreferrer"><span className="wa-glyph">wa</span>Buy now</a></div><div className="detail-assurances"><div><Truck size={18} /><span><b>Shipping</b>Free on prepaid orders</span></div><div><ShieldCheck size={18} /><span><b>Warranty</b>6 months, included</span></div><div><Sparkles size={18} /><span><b>Packaging</b>Protected with care</span></div></div><div className="detail-accordion"><details open><summary>The Drip Essential promise <ChevronDown size={16} /></summary><p>Each order is carefully checked, safely packed, and supported by a six-month warranty. For extra reassurance, our concierge is only a WhatsApp message away.</p></details><details><summary>Payments & delivery <ChevronDown size={16} /></summary><p>We accept Visa, Mastercard, UPI and COD. Prepaid orders qualify for free shipping. Message us for the latest delivery estimate to your pin code.</p></details></div></div></section>{related.length > 0 && <section className="related-section container-wide"><div className="section-heading row-heading"><div><span className="eyebrow">MORE FROM {product.brand}</span><h2>Keep exploring.</h2></div><Link href={`/watches/${slugify(product.brand)}`} className="text-link">View brand <ArrowRight size={15} /></Link></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}</main><Footer /><BagDrawer /></div>;
}

export function InfoPage() {
  const [location] = useLocation();
  const page = location.split("?")[0].replace("/", "") || "about";
  const content = page === "shipping" ? { eyebrow: "A LITTLE MORE CERTAINTY", title: "Arrives with care.", intro: "Your timepiece should feel considered from the first click to the first wrist placement.", sections: [["Free shipping on prepaid orders", "We offer free shipping on prepaid orders. For COD orders, shipping is calculated at checkout or confirmed by our team over WhatsApp."], ["Carefully packed", "Every watch is wrapped and secured in protective packaging so it reaches you safely and ready to wear."], ["Need a delivery update?", "Send your order details to dripessential62@gmail.com or message +91 91377 22174 for a quick update."]] } : page === "returns" ? { eyebrow: "THE FINE PRINT, MADE FRIENDLY", title: "A straightforward return policy.", intro: "If something is not right, talk to us. We would rather make it right than make you work for it.", sections: [["Start with a conversation", "Contact us on WhatsApp or email with your order number and a clear note about the issue. Our team will guide you through the next step."], ["Keep it as received", "Please retain the original packaging and ensure the watch is unworn and in its original condition while your request is reviewed."], ["We stay close", "For current return windows and item-specific details, reach out before sending anything back so we can give you the right instruction."]] } : { eyebrow: "THE DRIP ESSENTIAL POINT OF VIEW", title: "Luxury, made more personal.", intro: "We are here for the watch people notice, the details people remember, and the kind of service that feels like a real conversation.", sections: [["A considered edit", "Our collection brings together 32 names and 671 timepieces, from icons you already know to pieces that deserve a closer look."], ["Trust is part of the product", "Six-month warranty, careful packaging, prepaid shipping support, and a human WhatsApp concierge are not afterthoughts here. They are part of the experience."], ["For every kind of collector", "Whether you are adding to a collection or choosing your first luxury-inspired timepiece, our job is to make the decision feel clear, confident, and yours."]] };
  return <div className="site-shell"><Header /><main><section className="info-hero"><div className="container-wide"><span className="eyebrow">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.intro}</p></div></section><section className="info-content container-narrow">{content.sections.map(([title, text], index) => <article key={title}><span className="info-number">0{index + 1}</span><div><h2>{title}</h2><p>{text}</p></div></article>)}<div className="info-contact"><span className="eyebrow">WE’RE HUMAN ON THE OTHER SIDE</span><h2>Have a question?<br /><em>Ask us directly.</em></h2><div><a className="button button-dark" href={WHATSAPP_BASE} target="_blank" rel="noreferrer">WhatsApp us <ArrowRight size={16} /></a><a className="text-link" href={`mailto:${EMAIL}`}>Email {EMAIL} <ArrowRight size={15} /></a></div></div></section></main><Footer /><BagDrawer /></div>;
}

function BagDrawer() {
  const { bag, bagOpen, setBagOpen, removeFromBag, setQuantity, bagTotal } = useStore();
  if (!bagOpen) return null;
  const message = `Hi Drip Essential, I would like to place an order.\n\n${bag.map((line) => `• ${line.product.name} (${line.product.brand}) × ${line.quantity} — ${money(line.product.price * line.quantity)}`).join("\n")}\n\nEstimated total: ${money(bagTotal)}\nPlease share the next steps.`;
  return <div className="drawer-layer"><button className="drawer-backdrop" aria-label="Close bag" onClick={() => setBagOpen(false)} /><aside className="bag-drawer"><div className="drawer-head"><div><span className="eyebrow">YOUR SELECTION</span><h2>Bag <span>({bag.reduce((sum, line) => sum + line.quantity, 0)})</span></h2></div><button className="icon-button" onClick={() => setBagOpen(false)} aria-label="Close bag"><X size={20} /></button></div>{bag.length ? <><div className="bag-lines">{bag.map((line) => <div className="bag-line" key={line.product.id}><img src={line.product.image || fallbackImage} alt={line.product.name} onError={imageWithFallback} /><div className="bag-line-copy"><span>{line.product.brand}</span><b>{line.product.name}</b><strong>{money(line.product.price)}</strong><div className="quantity"><button onClick={() => setQuantity(line.product.id, line.quantity - 1)}><Minus size={13} /></button><span>{line.quantity}</span><button onClick={() => setQuantity(line.product.id, line.quantity + 1)}><Plus size={13} /></button><button className="remove" onClick={() => removeFromBag(line.product.id)}>Remove</button></div></div></div>)}</div><div className="drawer-summary"><div><span>Estimated total</span><strong>{money(bagTotal)}</strong></div><small>Final shipping and availability will be confirmed by our concierge.</small><a className="button button-dark full-button" href={makeWhatsAppUrl(message)} target="_blank" rel="noreferrer">Continue on WhatsApp <ArrowRight size={16} /></a><span className="payment-note">Securely assisted checkout · UPI · cards · COD</span></div></> : <div className="empty-bag"><ShoppingBag size={28} /><h3>Your bag is waiting.</h3><p>Add a piece that feels like you.</p><Link className="button button-dark" href="/watches" onClick={() => setBagOpen(false)}>Explore watches <ArrowRight size={16} /></Link></div>}</aside></div>;
}

export default Home;
