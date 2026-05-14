const express = require('express')
const router = express.Router()
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT harvests.*, crops.crop_name FROM harvests JOIN crops ON harvests.crop_id = crops.id ORDER BY harvests.created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { crop_id, harvest_date, quantity_kg, notes } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO harvests (crop_id, harvest_date, quantity_kg, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [crop_id, harvest_date, quantity_kg, notes]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  const { crop_id, harvest_date, quantity_kg, notes } = req.body
  try {
    const result = await pool.query(
      'UPDATE harvests SET crop_id=$1, harvest_date=$2, quantity_kg=$3, notes=$4 WHERE id=$5 RETURNING *',
      [crop_id, harvest_date, quantity_kg, notes, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM harvests WHERE id = $1', [req.params.id])
    res.json({ message: 'Harvest deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
