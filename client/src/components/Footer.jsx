import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { useCategories } from '../api/hooks';
import CategoryGlyph from '../icons/CategoryGlyph';
import { MapPin, Phone, Mail, WhatsApp, Instagram, Youtube, Facebook, Twitter, Truck, Shield, Lock } from '../icons/Icon';
import './Footer.css';

export default function Footer() {
  const categories = useCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-trust">
        <div className="container footer-trust__inner">
          <div className="footer-trust__item">
            <Truck size={22} />
            <div>
              <strong>Free shipping</strong>
              <span>On orders across India</span>
            </div>
          </div>
          <div className="footer-trust__item">
            <Shield size={22} />
            <div>
              <strong>Secure checkout</strong>
              <span>Encrypted payments via Razorpay</span>
            </div>
          </div>
          <div className="footer-trust__item">
            <Lock size={22} />
            <div>
              <strong>Cash on Delivery</strong>
              <span>Pay when your order arrives</span>
            </div>
          </div>
          <div className="footer-trust__item">
            <Phone size={22} />
            <div>
              <strong>Real human support</strong>
              <span>{BRAND.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-main">
        <div className="footer-col footer-col--brand">
          <div className="header-logo">
            <span className="header-logo__mark">
              <CategoryGlyph icon="drone" fg="#fff" />
            </span>
            <span className="header-logo__text">{BRAND.name}</span>
          </div>
          <p>
            {BRAND.tagline} — drones, RC cars, planes, gel blasters, gadgets and spares, shipped nationwide with
            genuine after-sales support.
          </p>
          <div className="footer-social">
            <a href={BRAND.social.instagram} aria-label="Instagram">
              <Instagram size={17} />
            </a>
            <a href={BRAND.social.youtube} aria-label="YouTube">
              <Youtube size={17} />
            </a>
            <a href={BRAND.social.facebook} aria-label="Facebook">
              <Facebook size={17} />
            </a>
            <a href={BRAND.social.twitter} aria-label="Twitter">
              <Twitter size={17} />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/shop/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Customer Service</h4>
          <ul>
            <li>
              <Link to="/account/orders">Track your order</Link>
            </li>
            <li>
              <Link to="/shipping-returns">Shipping &amp; Returns</Link>
            </li>
            <li>
              <Link to="/faq">FAQs</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Get in touch</h4>
          <ul className="footer-contact">
            <li>
              <MapPin size={16} /> <span>{BRAND.address}</span>
            </li>
            <li>
              <Phone size={16} /> <a href={BRAND.phoneHref}>{BRAND.phone}</a>
            </li>
            <li>
              <WhatsApp size={16} />{' '}
              <a href={BRAND.whatsapp} target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <Mail size={16} /> <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <span>
            &copy; {year} {BRAND.name}. All rights reserved.
          </span>
          <span className="footer-payments">Cards &middot; UPI &middot; Net Banking &middot; Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
}
