const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { checkAllParcels } = require('../scheduler');

router.get('/', async (req, res) => {
  const db = await getDB();
  const parcels = await db.all(`
    SELECT *, DATE(created_at) as group_date
    FROM parcels
    ORDER BY created_at DESC
  `);
  res.render('index', { parcels });
});

router.post('/add', async (req, res) => {
  const { track_code } = req.body;
  const db = await getDB();
  await db.run(
    'INSERT OR IGNORE INTO parcels (track_code) VALUES (?)',
    [track_code]
  );
  res.redirect('/');
});

router.post('/delete/:id', async (req, res) => {
  const db = await getDB();
  await db.run('DELETE FROM parcels WHERE id = ?', [req.params.id]);
  res.redirect('/');
});

router.post('/check-now', async (req, res) => {
  await checkAllParcels();
  res.redirect('/');
});

module.exports = router;
