import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import ProductArt from '../../icons/ProductArt';
import { formatPrice, formatDate } from '../../utils/format';
import { Package } from '../../icons/Icon';
import '../Cart.css';
import './Account.css';

const STATUS_LABEL = {
  placed: 'Placed',
  pending_payment: 'Awaiting Payment',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    client.get('/orders').then((res) => setOrders(res.data.orders));
  }, []);

  if (!orders) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container empty-state">
        <Package size={40} style={{ margin: '0 auto 16px', color: 'var(--color-text-faint)' }} />
        <h3>No orders yet</h3>
        <p>When you place an order, it will show up here.</p>
        <Link to="/shop" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container account-page">
      <h1>My Orders</h1>
      <div className="order-list">
        {orders.map((o) => (
          <Link to={`/account/orders/${o.id}`} key={o.id} className="order-row">
            <ProductArt
              imageKey={o.firstItem?.image_key || 'drone'}
              imageVariant={o.firstItem?.image_variant || 0}
              className="order-row__thumb"
            />
            <div className="order-row__info">
              <strong>#{o.order_number}</strong>
              <span>
                {o.itemCount} item{o.itemCount !== 1 ? 's' : ''} &middot; {formatDate(o.created_at)}
              </span>
            </div>
            <span className={`order-status order-status--${o.status}`}>{STATUS_LABEL[o.status] || o.status}</span>
            <strong className="order-row__total">{formatPrice(o.total)}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
