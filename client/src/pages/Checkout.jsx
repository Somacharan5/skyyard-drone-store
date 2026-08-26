import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client, { apiErrorMessage } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { loadRazorpayScript } from '../utils/razorpay';
import { formatPrice } from '../utils/format';
import { BRAND } from '../config/brand';
import { Lock } from '../icons/Icon';
import './Checkout.css';

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [saveAddress, setSaveAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [razorpayEnabled, setRazorpayEnabled] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    client.get('/addresses').then((res) => {
      setSavedAddresses(res.data.addresses);
      const def = res.data.addresses.find((a) => a.is_default) || res.data.addresses[0];
      if (def) applyAddress(def);
    });
    client.get('/orders/payment-config').then((res) => setRazorpayEnabled(res.data.razorpayEnabled));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <h3>Your cart is empty</h3>
        <p>Add a few products before checking out.</p>
        <Link to="/shop" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  function applyAddress(a) {
    setSelectedAddressId(a.id);
    setAddress({
      fullName: a.full_name,
      phone: a.phone,
      line1: a.line1,
      line2: a.line2 || '',
      city: a.city,
      state: a.state,
      pincode: a.pincode,
    });
  }

  function useNewAddress() {
    setSelectedAddressId('new');
    setAddress({ fullName: user?.name || '', phone: user?.phone || '', line1: '', line2: '', city: '', state: '', pincode: '' });
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  async function placeOrder(e) {
    e.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(address.pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }
    if (!/^\d{10}$/.test(address.phone.replace(/\D/g, '').slice(-10))) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setSubmitting(true);
    try {
      if (saveAddress && (selectedAddressId === 'new' || !selectedAddressId)) {
        await client.post('/addresses', { ...address, isDefault: savedAddresses.length === 0 }).catch(() => null);
      }

      const orderItems = items.map((i) => ({ productId: i.productId, qty: i.qty }));
      const { data } = await client.post('/orders', { items: orderItems, address, paymentMethod });

      if (paymentMethod === 'cod') {
        clearCart();
        navigate(`/order/${data.order.id}/success`);
        return;
      }

      // Razorpay flow
      const loaded = await loadRazorpayScript();
      if (!loaded || !data.razorpay) {
        setError('Could not start the payment gateway. Please try Cash on Delivery instead.');
        setSubmitting(false);
        return;
      }

      const rp = new window.Razorpay({
        key: data.razorpay.keyId,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        order_id: data.razorpay.orderId,
        name: BRAND.name,
        description: `Order ${data.order.order_number}`,
        theme: { color: '#2298c6' },
        prefill: { name: address.fullName, contact: address.phone, email: user?.email },
        handler: async (response) => {
          try {
            await client.post(`/orders/${data.order.id}/verify-payment`, response);
            clearCart();
            navigate(`/order/${data.order.id}/success`);
          } catch (err) {
            setError(apiErrorMessage(err, 'Payment verification failed. Please contact support with your order number.'));
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });
      rp.on('payment.failed', () => {
        setError('Payment failed. You can try again or choose Cash on Delivery.');
        setSubmitting(false);
      });
      rp.open();
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not place your order'));
      setSubmitting(false);
    }
  }

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>

      <form className="checkout-layout" onSubmit={placeOrder}>
        <div className="checkout-main">
          <section className="checkout-section">
            <h3>Delivery Address</h3>

            {savedAddresses.length > 0 && (
              <div className="address-cards">
                {savedAddresses.map((a) => (
                  <button
                    type="button"
                    key={a.id}
                    className={`address-card ${selectedAddressId === a.id ? 'is-active' : ''}`}
                    onClick={() => applyAddress(a)}
                  >
                    <strong>{a.full_name}</strong>
                    <span>
                      {a.line1}, {a.city}, {a.state} {a.pincode}
                    </span>
                    <span>{a.phone}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className={`address-card address-card--new ${selectedAddressId === 'new' ? 'is-active' : ''}`}
                  onClick={useNewAddress}
                >
                  + Add a new address
                </button>
              </div>
            )}

            {(savedAddresses.length === 0 || selectedAddressId === 'new') && (
              <div className="address-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>Full name</label>
                    <input required value={address.fullName} onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))} />
                  </div>
                  <div className="form-field">
                    <label>Phone number</label>
                    <input required value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} />
                  </div>
                </div>
                <div className="form-field">
                  <label>Address line 1</label>
                  <input
                    required
                    value={address.line1}
                    onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                    placeholder="House no., building, street"
                  />
                </div>
                <div className="form-field">
                  <label>Address line 2 (optional)</label>
                  <input value={address.line2} onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))} placeholder="Landmark, area" />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>City</label>
                    <input required value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} />
                  </div>
                  <div className="form-field">
                    <label>Pincode</label>
                    <input
                      required
                      maxLength={6}
                      value={address.pincode}
                      onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value.replace(/\D/g, '') }))}
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label>State</label>
                  <select required value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="checkout-checkbox">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                  Save this address for next time
                </label>
              </div>
            )}
          </section>

          <section className="checkout-section">
            <h3>Payment Method</h3>
            <label className={`payment-option ${paymentMethod === 'cod' ? 'is-active' : ''}`}>
              <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <div>
                <strong>Cash on Delivery</strong>
                <span>Pay in cash when your order arrives</span>
              </div>
            </label>
            <label className={`payment-option ${paymentMethod === 'razorpay' ? 'is-active' : ''} ${!razorpayEnabled ? 'is-disabled' : ''}`}>
              <input
                type="radio"
                name="payment"
                disabled={!razorpayEnabled}
                checked={paymentMethod === 'razorpay'}
                onChange={() => setPaymentMethod('razorpay')}
              />
              <div>
                <strong>Pay Online</strong>
                <span>
                  {razorpayEnabled ? 'UPI, cards & net banking via Razorpay' : 'Coming soon — please use Cash on Delivery for now'}
                </span>
              </div>
            </label>
          </section>

          {error && <div className="alert alert-error">{error}</div>}
        </div>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          <ul className="checkout-summary__items">
            {items.map((i) => (
              <li key={i.productId}>
                <span>
                  {i.name} <em>&times;{i.qty}</em>
                </span>
                <span>{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button className="btn btn-primary btn-block" disabled={submitting}>
            <Lock size={15} /> {submitting ? 'Processing...' : `Place Order — ${formatPrice(total)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}
