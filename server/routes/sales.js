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
    const result = await pool.query('SELECT sales.*, farmers.name as farmer_name FROM sales JOIN farmers ON sales.farmer_id = farmers.id ORDER BY sales.created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { farmer_id, crop_name, quantity_kg, price_per_kg, total_amount, buyer_name, sale_date } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO sales (farmer_id, crop_name, quantity_kg, price_per_kg, total_amount, buyer_name, sale_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [farmer_id, crop_name, quantity_kg, price_per_kg, total_amount, buyer_name, sale_date]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  const { farmer_id, crop_name, quantity_kg, price_per_kg, total_amount, buyer_name, sale_date } = req.body
  try {
    const result = await pool.query(
      'UPDATE sales SET farmer_id=$1, crop_name=$2, quantity_kg=$3, price_per_kg=$4, total_amount=$5, buyer_name=$6, sale_date=$7 WHERE id=$8 RETURNING *',
      [farmer_id, crop_name, quantity_kg, price_per_kg, total_amount, buyer_name, sale_date, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM sales WHERE id = $1', [req.params.id])
    res.json({ message: 'Sale deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
