import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import client from '../api/client';
import { useCategories } from '../api/hooks';
import ProductCard from '../components/ProductCard';
import CategoryGlyph from '../icons/CategoryGlyph';
import { Filter, Close } from '../icons/Icon';
import './Shop.css';

const PRICE_BUCKETS = [
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 – ₹6,000', min: 2000, max: 6000 },
  { label: '₹6,000 – ₹15,000', min: 6000, max: 15000 },
  { label: 'Above ₹15,000', min: 15000, max: null },
];

export default function Shop() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useCategories();
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const q = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || '';
  const brand = searchParams.get('brand') || '';
  const priceIdx = searchParams.get('price');

  useEffect(() => {
    client.get('/products/brands').then((res) => setBrands(res.data.brands));
  }, []);

  useEffect(() => {
    const params = {};
    if (categorySlug) params.category = categorySlug;
    if (q) params.q = q;
    if (sort) params.sort = sort;
    if (brand) params.brand = brand;
    if (priceIdx !== null && PRICE_BUCKETS[priceIdx]) {
      params.minPrice = PRICE_BUCKETS[priceIdx].min;
      if (PRICE_BUCKETS[priceIdx].max) params.maxPrice = PRICE_BUCKETS[priceIdx].max;
    }
    setProducts(null);
    client.get('/products', { params }).then((res) => setProducts(res.data.products));
  }, [categorySlug, q, sort, brand, priceIdx]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug]
  );

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
    setMobileFiltersOpen(false);
  }

  function clearFilters() {
    setSearchParams(q ? { q } : {});
    setMobileFiltersOpen(false);
  }

  const hasFilters = brand || priceIdx !== null;

  const sidebar = (
    <aside className="shop-sidebar">
      <div className="shop-sidebar__head">
        <h3>Filters</h3>
        {hasFilters && (
          <button className="shop-sidebar__clear" onClick={clearFilters}>
            Clear all
          </button>
        )}
      </div>

      <div className="shop-filter-group">
        <h4>Category</h4>
        <ul>
          <li>
            <Link to="/shop" className={!categorySlug ? 'is-active' : ''}>
              All Products
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link to={`/shop/${c.slug}`} className={categorySlug === c.slug ? 'is-active' : ''}>
                <CategoryGlyph icon={c.icon} fg="currentColor" /> {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="shop-filter-group">
        <h4>Price</h4>
        <ul>
          {PRICE_BUCKETS.map((b, i) => (
            <li key={b.label}>
              <button
                className={String(priceIdx) === String(i) ? 'is-active' : ''}
                onClick={() => updateParam('price', String(priceIdx) === String(i) ? null : String(i))}
              >
                {b.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="shop-filter-group">
        <h4>Brand</h4>
        <ul>
          {brands.map((b) => (
            <li key={b}>
              <button className={brand === b ? 'is-active' : ''} onClick={() => updateParam('brand', brand === b ? null : b)}>
                {b}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );

  return (
    <div className="shop-page container">
      <div className="shop-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link>
        {activeCategory && (
          <>
            {' '}
            / <span>{activeCategory.name}</span>
          </>
        )}
      </div>

      <div className="shop-heading">
        <h1>{q ? `Search results for "${q}"` : activeCategory ? activeCategory.name : 'All Products'}</h1>
        {products && <span>{products.length} product{products.length !== 1 ? 's' : ''} found</span>}
      </div>

      <div className="shop-layout">
        {sidebar}

        <div className="shop-content">
          <div className="shop-toolbar">
            <button className="shop-toolbar__filter-btn" onClick={() => setMobileFiltersOpen(true)}>
              <Filter size={15} /> Filters
            </button>
            <select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
              <option value="">Sort: Featured</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>

          {!products ? (
            <div className="page-loading">
              <div className="spinner" />
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try clearing filters or searching for something else.</p>
              <Link to="/shop" className="btn btn-primary">
                View all products
              </Link>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`mobile-filters ${mobileFiltersOpen ? 'is-open' : ''}`}>
        <div className="mobile-drawer__backdrop" onClick={() => setMobileFiltersOpen(false)} />
        <div className="mobile-filters__panel">
          <div className="mobile-drawer__head">
            <h3>Filters</h3>
            <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close">
              <Close size={20} />
            </button>
          </div>
          {sidebar}
        </div>
      </div>
    </div>
  );
}
