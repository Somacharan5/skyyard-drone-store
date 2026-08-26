const express = require('express');
const db = require('../db/connection');

const router = express.Router();

router.get('/', (req, res) => {
  const categories = db
    .prepare(
      `SELECT c.id, c.name, c.slug, c.icon,
              (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
       FROM categories c
       ORDER BY c.sort_order ASC`
    )
    .all();
  res.json({ categories });
});

module.exports = router;
