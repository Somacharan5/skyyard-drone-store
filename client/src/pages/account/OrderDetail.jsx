import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../../api/client';
import ProductArt from '../../icons/ProductArt';
import { formatPrice, formatDate } from '../../utils/format';
import './Account.css';

const STATUS_LABEL = {
  placed: 'Placed',
  pending_payment: 'Awaiting Payment',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    client.get(`/orders/${id}`).then((res) => {
      setOrder(res.data.order);
      setItems(res.data.items);
    });
  }, [id]);

  if (!order) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container account-page">
      <div className="shop-breadcrumb">
        <Link to="/account/orders">My Orders</Link> / <span>#{order.order_number}</span>
      </div>

      <div className="order-detail__head">
        <div>
          <h1>Order #{order.order_number}</h1>
          <span>Placed on {formatDate(order.created_at)}</span>
        </div>
        <span className={`order-status order-status--${order.status}`}>{STATUS_LABEL[order.status] || order.status}</span>
      </div>

      <div className="order-detail__layout">
        <div>
          <div className="checkout-section">
            <h3>Items</h3>
            <ul className="order-detail__items">
              {items.map((it) => (
                <li key={it.id}>
                  <ProductArt imageKey={it.image_key} imageVariant={it.image_variant} className="cart-row__thumb" />
                  <div>
                    <strong>{it.name}</strong>
                    <span>
                      Qty {it.qty} &times; {formatPrice(it.price)}
                    </span>
                  </div>
                  <strong>{formatPrice(it.price * it.qty)}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="checkout-section">
            <h3>Delivery Address</h3>
            <p className="order-detail__address">
              {order.address_full_name}
              <br />
              {order.address_line1}
              {order.address_line2 ? `, ${order.address_line2}` : ''}
              <br />
              {order.address_city}, {order.address_state} {order.address_pincode}
              <br />
              Phone: {order.address_phone}
            </p>
          </div>
        </div>

        <aside className="checkout-summary">
          <h3>Payment Summary</h3>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span>{order.shipping_fee === 0 ? 'Free' : formatPrice(order.shipping_fee)}</span>
          </div>
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Payment Method</span>
            <span>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</span>
          </div>
          <div className="cart-summary__row">
            <span>Payment Status</span>
            <span style={{ textTransform: 'capitalize' }}>{order.payment_status}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
