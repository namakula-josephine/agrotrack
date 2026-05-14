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
    const result = await pool.query('SELECT * FROM farmers ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { name, phone, location, land_size } = req.body
  console.log('Received:', req.body)
  try {
    const result = await pool.query(
      'INSERT INTO farmers (name, phone, location, land_size) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, phone, location, land_size]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  const { name, phone, location, land_size } = req.body
  try {
    const result = await pool.query(
      'UPDATE farmers SET name=$1, phone=$2, location=$3, land_size=$4 WHERE id=$5 RETURNING *',
      [name, phone, location, land_size, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM farmers WHERE id = $1', [req.params.id])
    res.json({ message: 'Farmer deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router