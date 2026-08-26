const express = require('express');
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC')
    .all(req.user.id);
  res.json({ addresses: rows });
});

router.post('/', (req, res) => {
  const { fullName, phone, line1, line2, city, state, pincode, isDefault } = req.body || {};
  if (!fullName || !phone || !line1 || !city || !state || !pincode) {
    return res.status(400).json({ error: 'Please fill in all required address fields' });
  }
  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ error: 'Enter a valid 6-digit pincode' });
  }

  const makeDefault = isDefault ? 1 : 0;
  const tx = db.transaction(() => {
    if (makeDefault) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(req.user.id);
    }
    return db
      .prepare(
        `INSERT INTO addresses (user_id, full_name, phone, line1, line2, city, state, pincode, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(req.user.id, fullName, phone, line1, line2 || null, city, state, pincode, makeDefault);
  });
  const info = tx();
  const address = db.prepare('SELECT * FROM addresses WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ address });
});

router.delete('/:id', (req, res) => {
  const addr = db.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!addr) return res.status(404).json({ error: 'Address not found' });
  db.prepare('DELETE FROM addresses WHERE id = ?').run(addr.id);
  res.json({ ok: true });
});

module.exports = router;
