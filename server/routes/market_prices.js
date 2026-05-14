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
    const result = await pool.query('SELECT * FROM market_prices ORDER BY recorded_date DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { crop_name, market_name, price_per_kg, recorded_date } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO market_prices (crop_name, market_name, price_per_kg, recorded_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [crop_name, market_name, price_per_kg, recorded_date]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  const { crop_name, market_name, price_per_kg, recorded_date } = req.body
  try {
    const result = await pool.query(
      'UPDATE market_prices SET crop_name=$1, market_name=$2, price_per_kg=$3, recorded_date=$4 WHERE id=$5 RETURNING *',
      [crop_name, market_name, price_per_kg, recorded_date, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM market_prices WHERE id = $1', [req.params.id])
    res.json({ message: 'Market price deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router