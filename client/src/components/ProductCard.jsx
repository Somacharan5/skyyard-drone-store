import { Link } from 'react-router-dom';
import ProductArt from '../icons/ProductArt';
import StarRating from './StarRating';
import { Heart, Cart } from '../icons/Icon';
import { formatPrice, discountPercent } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const off = discountPercent(product.price, product.compareAtPrice);
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card__media">
        <ProductArt imageKey={product.imageKey} imageVariant={product.imageVariant} />
        <div className="product-card__badges">
          {off && <span className="badge badge-sale">-{off}%</span>}
          {!off && product.badge && (
            <span className={`badge ${product.badge === 'New' ? 'badge-new' : 'badge-hot'}`}>{product.badge}</span>
          )}
          {!product.inStock && <span className="badge badge-outline">Out of stock</span>}
        </div>
        <button
          type="button"
          className={`product-card__wish ${wishlisted ? 'is-active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </Link>

      <div className="product-card__body">
        <span className="product-card__brand">{product.brand}</span>
        <Link to={`/product/${product.slug}`} className="product-card__name">
          {product.name}
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} size={12} />
        <div className="product-card__price">
          <span className="price-now">{formatPrice(product.price)}</span>
          {product.compareAtPrice && <span className="price-old">{formatPrice(product.compareAtPrice)}</span>}
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm btn-block product-card__add"
          disabled={!product.inStock}
          onClick={() => addItem(product, 1)}
        >
          <Cart size={15} />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
