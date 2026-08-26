const express = require('express');
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function serializeProduct(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    categoryId: row.category_id,
    categorySlug: row.category_slug,
    categoryName: row.category_name,
    brand: row.brand,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    shortDescription: row.short_description,
    description: row.description,
    specs: row.specs ? JSON.parse(row.specs) : {},
    imageKey: row.image_key,
    imageVariant: row.image_variant,
    stock: row.stock,
    inStock: row.stock > 0,
    rating: row.rating,
    reviewCount: row.review_count,
    badge: row.badge,
    featured: !!row.featured,
  };
}

const BASE_SELECT = `
  SELECT p.*, c.slug AS category_slug, c.name AS category_name
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

router.get('/', (req, res) => {
  const { category, q, sort, minPrice, maxPrice, brand, featured, limit, ids } = req.query;

  const where = [];
  const params = {};

  if (ids) {
    const idList = String(ids)
      .split(',')
      .map((s) => Number(s.trim()))
      .filter(Number.isInteger);
    if (idList.length === 0) return res.json({ products: [], total: 0 });
    where.push(`p.id IN (${idList.join(',')})`);
  }
  if (category) {
    where.push('c.slug = @category');
    params.category = category;
  }
  if (q) {
    where.push('(p.name LIKE @q OR p.brand LIKE @q OR p.short_description LIKE @q)');
    params.q = `%${q}%`;
  }
  if (minPrice) {
    where.push('p.price >= @minPrice');
    params.minPrice = Number(minPrice);
  }
  if (maxPrice) {
    where.push('p.price <= @maxPrice');
    params.maxPrice = Number(maxPrice);
  }
  if (brand) {
    where.push('p.brand = @brand');
    params.brand = brand;
  }
  if (featured) {
    where.push('p.featured = 1');
  }

  let orderBy = 'p.created_at DESC';
  if (sort === 'price_asc') orderBy = 'p.price ASC';
  else if (sort === 'price_desc') orderBy = 'p.price DESC';
  else if (sort === 'rating') orderBy = 'p.rating DESC';
  else if (sort === 'name') orderBy = 'p.name ASC';

  let sql = BASE_SELECT;
  if (where.length) sql += ` WHERE ${where.join(' AND ')}`;
  sql += ` ORDER BY ${orderBy}`;
  if (limit) sql += ` LIMIT ${Math.min(Number(limit) || 20, 100)}`;

  const rows = db.prepare(sql).all(params);
  res.json({ products: rows.map(serializeProduct), total: rows.length });
});

router.get('/brands', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT brand FROM products ORDER BY brand ASC').all();
  res.json({ brands: rows.map((r) => r.brand) });
});

router.get('/:slug', (req, res) => {
  const row = db.prepare(`${BASE_SELECT} WHERE p.slug = @slug`).get({ slug: req.params.slug });
  if (!row) return res.status(404).json({ error: 'Product not found' });

  const related = db
    .prepare(`${BASE_SELECT} WHERE p.category_id = @categoryId AND p.id != @id ORDER BY RANDOM() LIMIT 4`)
    .all({ categoryId: row.category_id, id: row.id });

  res.json({ product: serializeProduct(row), related: related.map(serializeProduct) });
});

router.get('/:slug/reviews', (req, res) => {
  const product = db.prepare('SELECT id FROM products WHERE slug = ?').get(req.params.slug);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const reviews = db
    .prepare('SELECT id, name, rating, comment, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC')
    .all(product.id);
  res.json({ reviews });
});

router.post('/:slug/reviews', requireAuth, (req, res) => {
  const { rating, comment } = req.body || {};
  const product = db.prepare('SELECT id FROM products WHERE slug = ?').get(req.params.slug);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const numRating = Number(rating);
  if (!numRating || numRating < 1 || numRating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  if (!comment || !comment.trim()) {
    return res.status(400).json({ error: 'Review comment is required' });
  }

  db.prepare('INSERT INTO reviews (product_id, user_id, name, rating, comment) VALUES (?, ?, ?, ?, ?)').run(
    product.id,
    req.user.id,
    req.user.name,
    numRating,
    comment.trim()
  );

  const agg = db
    .prepare('SELECT COUNT(*) AS count, AVG(rating) AS avg FROM reviews WHERE product_id = ?')
    .get(product.id);
  db.prepare('UPDATE products SET rating = ?, review_count = ? WHERE id = ?').run(
    Math.round(agg.avg * 10) / 10,
    agg.count,
    product.id
  );

  res.status(201).json({ ok: true });
});

module.exports = router;
