const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const { generateOrderNumber } = require('../utils/orderNumber');

const router = express.Router();
router.use(requireAuth);

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

router.get('/payment-config', (req, res) => {
  res.json({ razorpayEnabled: !!getRazorpay(), keyId: process.env.RAZORPAY_KEY_ID || null });
});

function buildOrderFromItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw { status: 400, message: 'Your cart is empty' };
  }

  const lineItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
    if (!product) throw { status: 400, message: `Product ${item.productId} no longer exists` };

    const qty = Math.max(1, Math.min(Number(item.qty) || 1, 20));
    if (product.stock < qty) {
      throw { status: 409, message: `${product.name} only has ${product.stock} left in stock` };
    }

    lineItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty,
      imageKey: product.image_key,
      imageVariant: product.image_variant,
    });
    subtotal += product.price * qty;
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  return { lineItems, subtotal, shippingFee, total };
}

router.post('/', (req, res) => {
  const { items, address, paymentMethod } = req.body || {};

  if (!address || !address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
    return res.status(400).json({ error: 'A complete delivery address is required' });
  }
  if (!['cod', 'razorpay'].includes(paymentMethod)) {
    return res.status(400).json({ error: 'Choose a valid payment method' });
  }

  let built;
  try {
    built = buildOrderFromItems(items);
  } catch (e) {
    return res.status(e.status || 400).json({ error: e.message || 'Could not process cart' });
  }

  const orderNumber = generateOrderNumber();

  const insertOrderTx = db.transaction((status, paymentStatus) => {
    const info = db
      .prepare(
        `INSERT INTO orders
          (order_number, user_id, status, subtotal, shipping_fee, total, payment_method, payment_status,
           address_full_name, address_phone, address_line1, address_line2, address_city, address_state, address_pincode)
         VALUES (@orderNumber, @userId, @status, @subtotal, @shippingFee, @total, @paymentMethod, @paymentStatus,
           @fullName, @phone, @line1, @line2, @city, @state, @pincode)`
      )
      .run({
        orderNumber,
        userId: req.user.id,
        status,
        subtotal: built.subtotal,
        shippingFee: built.shippingFee,
        total: built.total,
        paymentMethod,
        paymentStatus,
        fullName: address.fullName,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 || null,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      });

    const orderId = info.lastInsertRowid;
    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, name, price, qty, image_key, image_variant)
       VALUES (@orderId, @productId, @name, @price, @qty, @imageKey, @imageVariant)`
    );
    for (const li of built.lineItems) insertItem.run({ orderId, ...li });

    return orderId;
  });

  if (paymentMethod === 'cod') {
    const orderId = insertOrderTx('placed', 'pending');
    const decrementStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    const tx2 = db.transaction(() => {
      for (const li of built.lineItems) decrementStock.run(li.qty, li.productId);
    });
    tx2();

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    return res.status(201).json({ order, razorpay: null });
  }

  // Razorpay flow: create the order record, then a Razorpay order to pay against.
  const razorpay = getRazorpay();
  if (!razorpay) {
    return res.status(503).json({
      error: 'Online payments are not configured yet. Please choose Cash on Delivery, or ask the store owner to add Razorpay API keys.',
    });
  }

  const orderId = insertOrderTx('pending_payment', 'created');

  razorpay.orders
    .create({
      amount: built.total * 100,
      currency: 'INR',
      receipt: orderNumber,
      notes: { orderId: String(orderId), orderNumber },
    })
    .then((rpOrder) => {
      db.prepare('UPDATE orders SET razorpay_order_id = ? WHERE id = ?').run(rpOrder.id, orderId);
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
      res.status(201).json({
        order,
        razorpay: { orderId: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency, keyId: process.env.RAZORPAY_KEY_ID },
      });
    })
    .catch((err) => {
      console.error('Razorpay order creation failed:', err);
      db.prepare("UPDATE orders SET status = 'cancelled', payment_status = 'failed' WHERE id = ?").run(orderId);
      res.status(502).json({ error: 'Could not start the payment. Please try again.' });
    });
});

router.post('/:id/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.razorpay_order_id !== razorpay_order_id) {
    return res.status(400).json({ error: 'Order/payment mismatch' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    db.prepare("UPDATE orders SET payment_status = 'failed' WHERE id = ?").run(order.id);
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  const tx = db.transaction(() => {
    db.prepare(
      "UPDATE orders SET payment_status = 'paid', status = 'placed', razorpay_payment_id = ? WHERE id = ?"
    ).run(razorpay_payment_id, order.id);

    const items = db.prepare('SELECT product_id, qty FROM order_items WHERE order_id = ?').all(order.id);
    const decrementStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    for (const it of items) decrementStock.run(it.qty, it.product_id);
  });
  tx();

  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id);
  res.json({ order: updated });
});

router.get('/', (req, res) => {
  const orders = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);

  const itemCountStmt = db.prepare('SELECT COUNT(*) AS c, SUM(qty) AS units FROM order_items WHERE order_id = ?');
  const firstItemStmt = db.prepare('SELECT name, image_key, image_variant FROM order_items WHERE order_id = ? LIMIT 1');

  const result = orders.map((o) => ({
    ...o,
    itemCount: itemCountStmt.get(o.id).units || 0,
    firstItem: firstItemStmt.get(o.id) || null,
  }));

  res.json({ orders: result });
});

router.get('/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  res.json({ order, items });
});

module.exports = router;
