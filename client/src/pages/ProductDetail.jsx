import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import client, { apiErrorMessage } from '../api/client';
import ProductArt from '../icons/ProductArt';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import { Heart, Cart, Minus, Plus, Truck, Rotate, Shield } from '../icons/Icon';
import { formatPrice, discountPercent, formatDate } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [notFound, setNotFound] = useState(false);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    setQty(1);
    client
      .get(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data.product);
        setRelated(res.data.related);
      })
      .catch(() => setNotFound(true));
    client.get(`/products/${slug}/reviews`).then((res) => setReviews(res.data.reviews));
  }, [slug]);

  if (notFound) {
    return (
      <div className="container empty-state">
        <h3>Product not found</h3>
        <p>This product may have been removed or the link is incorrect.</p>
        <Link to="/shop" className="btn btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  const off = discountPercent(product.price, product.compareAtPrice);
  const wishlisted = isWishlisted(product.id);

  function handleBuyNow() {
    addItem(product, qty);
    navigate('/checkout');
  }

  async function submitReview(e) {
    e.preventDefault();
    setReviewError('');
    if (!reviewForm.comment.trim()) {
      setReviewError('Please write a short review before submitting.');
      return;
    }
    setReviewSubmitting(true);
    try {
      await client.post(`/products/${slug}/reviews`, reviewForm);
      const res = await client.get(`/products/${slug}/reviews`);
      setReviews(res.data.reviews);
      const p = await client.get(`/products/${slug}`);
      setProduct(p.data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      setReviewError(apiErrorMessage(err, 'Could not submit your review'));
    } finally {
      setReviewSubmitting(false);
    }
  }

  return (
    <div className="container product-detail">
      <div className="shop-breadcrumb">
        <Link to="/">Home</Link> / <Link to={`/shop/${product.categorySlug}`}>{product.categoryName}</Link> /{' '}
        <span>{product.name}</span>
      </div>

      <div className="pd-layout">
        <div className="pd-media">
          <ProductArt imageKey={product.imageKey} imageVariant={product.imageVariant} className="pd-media__art" />
        </div>

        <div className="pd-info">
          <span className="product-card__brand">{product.brand}</span>
          <h1>{product.name}</h1>
          <div className="pd-info__rating">
            <StarRating rating={product.rating} count={product.reviewCount} size={15} />
            <span className={product.inStock ? 'pd-stock pd-stock--in' : 'pd-stock pd-stock--out'}>
              {product.inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <div className="pd-price">
            <span className="price-now">{formatPrice(product.price)}</span>
            {product.compareAtPrice && <span className="price-old">{formatPrice(product.compareAtPrice)}</span>}
            {off && <span className="badge badge-sale">Save {off}%</span>}
          </div>

          <p className="pd-short">{product.shortDescription}</p>

          <div className="pd-buy">
            <div className="pd-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <Minus size={14} />
              </button>
              <span>{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase quantity"
                disabled={qty >= product.stock}
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              className="btn btn-outline"
              disabled={!product.inStock}
              onClick={() => addItem(product, qty)}
            >
              <Cart size={16} /> Add to Cart
            </button>
            <button className="btn btn-primary" disabled={!product.inStock} onClick={handleBuyNow}>
              Buy Now
            </button>
            <button
              className={`pd-wish ${wishlisted ? 'is-active' : ''}`}
              onClick={() => toggle(product.id)}
              aria-label="Toggle wishlist"
            >
              <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="pd-assurances">
            <span>
              <Truck size={16} /> Free shipping across India
            </span>
            <span>
              <Rotate size={16} /> 7-day easy returns
            </span>
            <span>
              <Shield size={16} /> Genuine product guarantee
            </span>
          </div>
        </div>
      </div>

      <div className="pd-tabs">
        <div className="pd-tabs__head">
          <button className={tab === 'description' ? 'is-active' : ''} onClick={() => setTab('description')}>
            Description
          </button>
          <button className={tab === 'specs' ? 'is-active' : ''} onClick={() => setTab('specs')}>
            Specifications
          </button>
          <button className={tab === 'reviews' ? 'is-active' : ''} onClick={() => setTab('reviews')}>
            Reviews ({reviews.length})
          </button>
        </div>

        <div className="pd-tabs__body">
          {tab === 'description' && <p>{product.description}</p>}

          {tab === 'specs' && (
            <table className="pd-specs">
              <tbody>
                {Object.entries(product.specs).map(([k, v]) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'reviews' && (
            <div className="pd-reviews">
              {reviews.length === 0 && <p className="pd-reviews__empty">No reviews yet. Be the first to review this product.</p>}
              <ul className="pd-reviews__list">
                {reviews.map((r) => (
                  <li key={r.id}>
                    <div className="pd-reviews__head">
                      <strong>{r.name}</strong>
                      <span>{formatDate(r.created_at)}</span>
                    </div>
                    <StarRating rating={r.rating} size={13} />
                    <p>{r.comment}</p>
                  </li>
                ))}
              </ul>

              {user ? (
                <form className="pd-review-form" onSubmit={submitReview}>
                  <h4>Write a review</h4>
                  {reviewError && <div className="alert alert-error">{reviewError}</div>}
                  <div className="form-field">
                    <label>Your rating</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} star{n !== 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Your review</label>
                    <textarea
                      rows={3}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                      placeholder="Tell other shoppers what you think..."
                    />
                  </div>
                  <button className="btn btn-primary" disabled={reviewSubmitting}>
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p className="pd-reviews__signin">
                  <Link to="/login">Sign in</Link> to write a review.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="section-head" style={{ marginTop: 50 }}>
          <div>
            <span className="section-kicker">You might also like</span>
            <h2>Related Products</h2>
          </div>
        </div>
      )}
      <div className="product-grid">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
