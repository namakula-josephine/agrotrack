import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const API = 'https://agrotrack-api.onrender.com/api'

function Dashboard() {
  const [farmers, setFarmers] = useState([])
  const [crops, setCrops] = useState([])
  const [harvests, setHarvests] = useState([])
  const [sales, setSales] = useState([])
  const [prices, setPrices] = useState([])

  useEffect(() => {
    axios.get(`${API}/farmers`).then(r => setFarmers(r.data))
    axios.get(`${API}/crops`).then(r => setCrops(r.data))
    axios.get(`${API}/harvests`).then(r => setHarvests(r.data))
    axios.get(`${API}/sales`).then(r => setSales(r.data))
    axios.get(`${API}/market-prices`).then(r => setPrices(r.data))
  }, [])

  const totalRevenue = sales.reduce((sum, s) => sum + parseFloat(s.total_amount || 0), 0)
  const totalHarvest = harvests.reduce((sum, h) => sum + parseFloat(h.quantity_kg || 0), 0)

  const cropStatusData = [
    { name: 'Growing', value: crops.filter(c => c.status === 'growing').length },
    { name: 'Harvested', value: crops.filter(c => c.status === 'harvested').length },
    { name: 'Failed', value: crops.filter(c => c.status === 'failed').length },
  ]

  const salesChartData = sales.slice(0, 6).map(s => ({
    name: s.crop_name,
    amount: parseFloat(s.total_amount)
  }))

  const cards = [
    { label: 'Total Farmers', value: farmers.length, color: '#2d6010', bg: '#f0f9e8' },
    { label: 'Total Crops', value: crops.length, color: '#1a56db', bg: '#eff6ff' },
    { label: 'Total Harvests', value: `${totalHarvest.toLocaleString()} kg`, color: '#b45309', bg: '#fffbeb' },
    { label: 'Total Revenue', value: `UGX ${totalRevenue.toLocaleString()}`, color: '#065f46', bg: '#ecfdf5' },
    { label: 'Market Prices', value: prices.length, color: '#6d28d9', bg: '#f5f3ff' },
    { label: 'Total Sales', value: sales.length, color: '#be123c', bg: '#fff1f2' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1a3a05', marginBottom: '24px' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {cards.map(card => (
          <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.color}22`, borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{card.label}</p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a3a05', marginBottom: '16px' }}>Sales Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="amount" fill="#2d6010" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a3a05', marginBottom: '16px' }}>Crop Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cropStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#4a8c1a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '20px', marginTop: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a3a05', marginBottom: '16px' }}>Recent Sales</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7faf2' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#2d6010' }}>Farmer</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#2d6010' }}>Crop</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#2d6010' }}>Qty (kg)</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#2d6010' }}>Total (UGX)</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#2d6010' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.slice(0, 5).map(sale => (
              <tr key={sale.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 14px', fontSize: '13px' }}>{sale.farmer_name}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px' }}>{sale.crop_name}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px' }}>{sale.quantity_kg}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '600', color: '#2d6010' }}>UGX {Number(sale.total_amount).toLocaleString()}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px', color: '#888' }}>{sale.sale_date?.split('T')[0]}</td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: '13px' }}>No sales yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard