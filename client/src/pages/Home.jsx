import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useCategories } from '../api/hooks';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import CategoryGlyph from '../icons/CategoryGlyph';
import { ArrowRight, Truck, Shield, Rotate, Lock, WhatsApp } from '../icons/Icon';
import { BRAND } from '../config/brand';
import './Home.css';

const BRANDS = ['SkyForce', 'TurboDrift', 'AeroMax', 'StrikeForce', 'VoltEdge', 'NovaRC'];

export default function Home() {
  const categories = useCategories();
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    client.get('/products', { params: { featured: 1, limit: 8 } }).then((res) => setFeatured(res.data.products));
    client.get('/products', { params: { sort: 'rating', limit: 8 } }).then((res) => setBestsellers(res.data.products));
    client.get('/products', { params: { sort: 'newest', limit: 4 } }).then((res) => setNewArrivals(res.data.products));
    client.get('/reviews/featured').then((res) => setReviews(res.data.reviews));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="badge badge-new hero__kicker">India&rsquo;s RC &amp; Drone Hobby Store</span>
            <h1>
              Buy Drones &amp; RC Cars <span>Online in India</span>
            </h1>
            <p>
              Camera drones, drift-ready RC cars, gel blasters and hobby-grade gadgets — genuine products,
              nationwide shipping, and real after-sales support from a team that flies what it sells.
            </p>
            <div className="hero__cta">
              <Link to="/shop" className="btn btn-primary">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/shop/drones" className="btn btn-outline">
                Explore Drones
              </Link>
            </div>
          </div>
          <div className="hero__art">
            <div className="hero__art-glow" />
            <CategoryGlyph icon="drone" fg="#fff" className="hero__glyph" />
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-strip__inner">
          <div className="trust-strip__item">
            <Truck size={20} /> Free shipping all over India
          </div>
          <div className="trust-strip__item">
            <Rotate size={20} /> Hassle-free 7-day returns
          </div>
          <div className="trust-strip__item">
            <Shield size={20} /> 100% secure checkout
          </div>
          <div className="trust-strip__item">
            <Lock size={20} /> Cash on Delivery available
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">Browse</span>
              <h2>Shop by Category</h2>
            </div>
          </div>
          <div className="category-grid">
            {categories.map((c) => (
              <Link key={c.id} to={`/shop/${c.slug}`} className="category-tile">
                <div className="category-tile__art">
                  <CategoryGlyph icon={c.icon} fg="var(--color-primary-dark)" />
                </div>
                <span className="category-tile__name">{c.name}</span>
                <span className="category-tile__count">{c.product_count} products</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">Handpicked</span>
              <h2>Featured Products</h2>
            </div>
            <Link to="/shop" className="view-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section promo-strip">
        <div className="container promo-strip__grid">
          <Link to="/shop/drones" className="promo-card promo-card--blue">
            <div>
              <span className="section-kicker" style={{ color: '#eaf6fc' }}>
                New Season
              </span>
              <h3>GPS Camera Drones</h3>
              <p>4K footage and 25-min flight times, from ₹3,490</p>
              <span className="promo-card__cta">
                Shop drones <ArrowRight size={14} />
              </span>
            </div>
            <CategoryGlyph icon="drone" fg="#ffffff" className="promo-card__glyph" />
          </Link>
          <Link to="/shop/gel-blasters-guns" className="promo-card promo-card--dark">
            <div>
              <span className="section-kicker" style={{ color: '#ffd9c7' }}>
                Backyard Battles
              </span>
              <h3>Gel Blasters &amp; Guns</h3>
              <p>Full-auto blasters and combo packs, from ₹1,290</p>
              <span className="promo-card__cta">
                Shop blasters <ArrowRight size={14} />
              </span>
            </div>
            <CategoryGlyph icon="blaster" fg="#ffffff" className="promo-card__glyph" />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">Top Rated</span>
              <h2>Bestsellers</h2>
            </div>
            <Link to="/shop?sort=rating" className="view-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="product-grid">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="section section-soft">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-kicker">Just In</span>
                <h2>Latest Arrivals</h2>
              </div>
              <Link to="/shop?sort=newest" className="view-all">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="product-grid">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section brand-strip">
        <div className="container">
          <span className="section-kicker" style={{ textAlign: 'center', display: 'block' }}>
            Trusted Brands
          </span>
          <div className="brand-strip__row">
            {BRANDS.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="section section-soft">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-kicker">Customer Love</span>
                <h2>What Riders &amp; Pilots Say</h2>
              </div>
            </div>
            <div className="testimonial-grid">
              {reviews.map((r) => (
                <div key={r.id} className="testimonial-card">
                  <StarRating rating={r.rating} size={13} />
                  <p>&ldquo;{r.comment}&rdquo;</p>
                  <div className="testimonial-card__foot">
                    <strong>{r.name}</strong>
                    <Link to={`/product/${r.product_slug}`}>on {r.product_name}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section whatsapp-cta">
        <div className="container whatsapp-cta__inner">
          <div>
            <h2>Join the {BRAND.name} community</h2>
            <p>New drops, restocks, and flash deals — straight to WhatsApp, no spam.</p>
          </div>
          <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="btn btn-primary">
            <WhatsApp size={16} /> Join Now
          </a>
        </div>
      </section>
    </div>
  );
}
