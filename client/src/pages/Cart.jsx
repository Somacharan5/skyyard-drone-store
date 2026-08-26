import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductArt from '../icons/ProductArt';
import { Minus, Plus, Trash, ArrowRight, Cart as CartIcon } from '../icons/Icon';
import { formatPrice } from '../utils/format';
import './Cart.css';

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <CartIcon size={40} style={{ margin: '0 auto 16px', color: 'var(--color-text-faint)' }} />
        <h3>Your cart is empty</h3>
        <p>Looks like you haven&rsquo;t added anything yet.</p>
        <Link to="/shop" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <div className="container cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          <div className="cart-items__head">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span></span>
          </div>
          {items.map((i) => (
            <div key={i.productId} className="cart-row">
              <Link to={`/product/${i.slug}`} className="cart-row__product">
                <ProductArt imageKey={i.imageKey} imageVariant={i.imageVariant} className="cart-row__thumb" />
                <span>{i.name}</span>
              </Link>
              <span className="cart-row__price" data-label="Price">
                {formatPrice(i.price)}
              </span>
              <div className="pd-qty cart-row__qty" data-label="Quantity">
                <button onClick={() => updateQty(i.productId, i.qty - 1)} aria-label="Decrease quantity">
                  <Minus size={13} />
                </button>
                <span>{i.qty}</span>
                <button
                  onClick={() => updateQty(i.productId, i.qty + 1)}
                  disabled={i.qty >= (i.stock ?? 99)}
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>
              <span className="cart-row__total" data-label="Total">
                {formatPrice(i.price * i.qty)}
              </span>
              <button className="cart-row__remove" onClick={() => removeItem(i.productId)} aria-label="Remove item">
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          {shipping > 0 && (
            <p className="cart-summary__hint">
              Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
            </p>
          )}
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
            Proceed to Checkout <ArrowRight size={16} />
          </button>
          <Link to="/shop" className="cart-summary__continue">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
