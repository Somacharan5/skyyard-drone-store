import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { useCategories } from '../api/hooks';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CategoryGlyph from '../icons/CategoryGlyph';
import ProductArt from '../icons/ProductArt';
import { Search, Phone, WhatsApp, User, Heart, Cart, Menu, Close, ChevronDown, Trash } from '../icons/Icon';
import { formatPrice } from '../utils/format';
import './Header.css';

export default function Header() {
  const categories = useCategories();
  const { user, logout } = useAuth();
  const { items, subtotal, count, removeItem } = useCart();
  const { count: wishCount } = useWishlist();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const accountRef = useRef(null);
  const cartRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function submitSearch(e) {
    e.preventDefault();
    navigate(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop');
    setMobileOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-topbar">
        <div className="container header-topbar__inner">
          <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="header-topbar__item">
            <Phone size={13} /> {BRAND.phone}
          </a>
          <div className="header-topbar__right">
            <span className="header-topbar__item header-topbar__ship">Free shipping across India &middot; Cash on Delivery available</span>
            <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="header-topbar__item">
              <WhatsApp size={13} /> Join our WhatsApp community
            </a>
          </div>
        </div>
      </div>

      <div className="container header-main">
        <button className="header-burger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>

        <Link to="/" className="header-logo">
          <span className="header-logo__mark">
            <CategoryGlyph icon="drone" fg="#fff" />
          </span>
          <span className="header-logo__text">
            {BRAND.name}
            <small>{BRAND.tagline}</small>
          </span>
        </Link>

        <form className="header-search" onSubmit={submitSearch}>
          <input
            type="search"
            placeholder="Search for drones, RC cars, blasters..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <Search size={18} />
          </button>
        </form>

        <div className="header-actions">
          <div className="header-actions__item" ref={accountRef}>
            <button className="header-actions__btn" onClick={() => setAccountOpen((v) => !v)}>
              <User size={20} />
              <span>{user ? user.name.split(' ')[0] : 'Account'}</span>
            </button>
            {accountOpen && (
              <div className="header-dropdown header-dropdown--account">
                {user ? (
                  <>
                    <Link to="/account/orders" onClick={() => setAccountOpen(false)}>
                      My Orders
                    </Link>
                    <button
                      className="header-dropdown__logout"
                      onClick={() => {
                        logout();
                        setAccountOpen(false);
                        navigate('/');
                      }}
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setAccountOpen(false)}>
                      Sign in
                    </Link>
                    <Link to="/register" onClick={() => setAccountOpen(false)}>
                      Create account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/wishlist" className="header-actions__item">
            <button className="header-actions__btn">
              <span className="header-actions__icon-wrap">
                <Heart size={20} />
                {wishCount > 0 && <span className="header-actions__count">{wishCount}</span>}
              </span>
              <span>Wishlist</span>
            </button>
          </Link>

          <div className="header-actions__item" ref={cartRef}>
            <button className="header-actions__btn" onClick={() => setCartOpen((v) => !v)}>
              <span className="header-actions__icon-wrap">
                <Cart size={20} />
                {count > 0 && <span className="header-actions__count">{count}</span>}
              </span>
              <span>{formatPrice(subtotal)}</span>
            </button>

            {cartOpen && (
              <div className="header-dropdown header-dropdown--cart">
                {items.length === 0 ? (
                  <p className="header-dropdown__empty">Your cart is empty.</p>
                ) : (
                  <>
                    <ul className="header-dropdown__items">
                      {items.slice(0, 4).map((i) => (
                        <li key={i.productId}>
                          <ProductArt imageKey={i.imageKey} imageVariant={i.imageVariant} className="header-dropdown__thumb" />
                          <div className="header-dropdown__meta">
                            <span>{i.name}</span>
                            <span className="header-dropdown__qty">
                              {i.qty} &times; {formatPrice(i.price)}
                            </span>
                          </div>
                          <button aria-label="Remove" onClick={() => removeItem(i.productId)}>
                            <Trash size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                    {items.length > 4 && <p className="header-dropdown__more">+{items.length - 4} more item(s)</p>}
                    <div className="header-dropdown__subtotal">
                      <span>Subtotal</span>
                      <strong>{formatPrice(subtotal)}</strong>
                    </div>
                    <div className="header-dropdown__actions">
                      <Link to="/cart" className="btn btn-outline btn-sm btn-block" onClick={() => setCartOpen(false)}>
                        View Cart
                      </Link>
                      <Link to="/checkout" className="btn btn-primary btn-sm btn-block" onClick={() => setCartOpen(false)}>
                        Checkout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="header-nav">
        <div className="container header-nav__inner">
          <Link to="/" className="header-nav__link">
            Home
          </Link>
          <Link to="/shop" className="header-nav__link">
            Shop All
          </Link>
          <div className="header-nav__dropdown-wrap">
            <button className="header-nav__link header-nav__link--dropdown">
              Shop by Category <ChevronDown size={14} />
            </button>
            <div className="header-nav__mega">
              {categories.map((c) => (
                <Link key={c.id} to={`/shop/${c.slug}`} className="header-nav__mega-item">
                  <CategoryGlyph icon={c.icon} fg="var(--color-primary)" />
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
          {categories.slice(0, 5).map((c) => (
            <Link key={c.id} to={`/shop/${c.slug}`} className="header-nav__link">
              {c.name}
            </Link>
          ))}
          <Link to="/about" className="header-nav__link">
            About
          </Link>
          <Link to="/contact" className="header-nav__link">
            Contact
          </Link>
        </div>
      </nav>

      <div className={`mobile-drawer ${mobileOpen ? 'is-open' : ''}`}>
        <div className="mobile-drawer__backdrop" onClick={() => setMobileOpen(false)} />
        <div className="mobile-drawer__panel">
          <div className="mobile-drawer__head">
            <span className="header-logo__text">{BRAND.name}</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <Close size={22} />
            </button>
          </div>
          <form className="header-search header-search--mobile" onSubmit={submitSearch}>
            <input
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <Search size={18} />
            </button>
          </form>
          <Link to="/" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link to="/shop" onClick={() => setMobileOpen(false)}>
            Shop All
          </Link>
          {categories.map((c) => (
            <Link key={c.id} to={`/shop/${c.slug}`} onClick={() => setMobileOpen(false)}>
              {c.name}
            </Link>
          ))}
          <Link to="/wishlist" onClick={() => setMobileOpen(false)}>
            Wishlist
          </Link>
          <Link to="/about" onClick={() => setMobileOpen(false)}>
            About
          </Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)}>
            Contact
          </Link>
          <hr />
          {user ? (
            <>
              <Link to="/account/orders" onClick={() => setMobileOpen(false)}>
                My Orders
              </Link>
              <button
                className="mobile-drawer__logout"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                Sign in
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
