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
    const result = await pool.query('SELECT crops.*, farmers.name as farmer_name FROM crops JOIN farmers ON crops.farmer_id = farmers.id ORDER BY crops.created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { farmer_id, crop_name, planting_date, expected_harvest, status } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO crops (farmer_id, crop_name, planting_date, expected_harvest, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [farmer_id, crop_name, planting_date, expected_harvest, status]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  const { farmer_id, crop_name, planting_date, expected_harvest, status } = req.body
  try {
    const result = await pool.query(
      'UPDATE crops SET farmer_id=$1, crop_name=$2, planting_date=$3, expected_harvest=$4, status=$5 WHERE id=$6 RETURNING *',
      [farmer_id, crop_name, planting_date, expected_harvest, status, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM crops WHERE id = $1', [req.params.id])
    res.json({ message: 'Crop deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
