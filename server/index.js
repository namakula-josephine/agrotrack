const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
require('dotenv').config()

const app = express()

app.use(cors({
  origin: 'https://agrotrack-ten.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use(express.json())

const farmersRoute = require('./routes/farmers')
app.use('/api/farmers', farmersRoute)

const cropsRoute = require('./routes/crops')
const harvestsRoute = require('./routes/harvests')
const marketPricesRoute = require('./routes/market_prices')
const salesRoute = require('./routes/sales')

app.use('/api/crops', cropsRoute)
app.use('/api/harvests', harvestsRoute)
app.use('/api/market-prices', marketPricesRoute)
app.use('/api/sales', salesRoute)

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.message)
  } else {
    console.log('Database connected successfully!')
    release()
  }
})

app.get('/', (req, res) => {
  res.json({ message: 'AgroTrack API is running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})