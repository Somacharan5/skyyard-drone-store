import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../api/client';
import { CheckCircle } from '../icons/Icon';
import { formatPrice } from '../utils/format';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    client.get(`/orders/${id}`).then((res) => setOrder(res.data.order));
  }, [id]);

  if (!order) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container order-success">
      <CheckCircle size={56} className="order-success__icon" />
      <h1>Order placed successfully!</h1>
      <p>
        Thanks, {order.address_full_name.split(' ')[0]} — your order <strong>#{order.order_number}</strong> has
        been confirmed
        {order.payment_method === 'cod' ? ' and will be collected on delivery.' : '.'}
      </p>

      <div className="order-success__card">
        <div className="order-success__row">
          <span>Order Number</span>
          <strong>{order.order_number}</strong>
        </div>
        <div className="order-success__row">
          <span>Payment Method</span>
          <strong>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</strong>
        </div>
        <div className="order-success__row">
          <span>Delivering to</span>
          <strong>
            {order.address_line1}, {order.address_city}, {order.address_state} {order.address_pincode}
          </strong>
        </div>
        <div className="order-success__row order-success__row--total">
          <span>Total Paid</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
      </div>

      <div className="order-success__actions">
        <Link to={`/account/orders/${order.id}`} className="btn btn-outline">
          View Order Details
        </Link>
        <Link to="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
