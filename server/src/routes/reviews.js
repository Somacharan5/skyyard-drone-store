const express = require('express');
const db = require('../db/connection');

const router = express.Router();

router.get('/featured', (req, res) => {
  const rows = db
    .prepare(
      `SELECT r.id, r.name, r.rating, r.comment, r.created_at, p.name AS product_name, p.slug AS product_slug
       FROM reviews r
       JOIN products p ON p.id = r.product_id
       ORDER BY r.created_at DESC
       LIMIT 6`
    )
    .all();
  res.json({ reviews: rows });
});

module.exports = router;
