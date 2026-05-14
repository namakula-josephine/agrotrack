import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://agrotrack-api.onrender.com/api'

function MarketPrices() {
  const [prices, setPrices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ crop_name: '', market_name: '', price_per_kg: '', recorded_date: '' })

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    const res = await axios.get(`${API}/market-prices`)
    setPrices(res.data)
  }

  const handleSubmit = async () => {
    if (editing) {
      await axios.put(`${API}/market-prices/${editing.id}`, form)
    } else {
      await axios.post(`${API}/market-prices`, form)
    }
    setForm({ crop_name: '', market_name: '', price_per_kg: '', recorded_date: '' })
    setEditing(null)
    setShowForm(false)
    fetchPrices()
  }

  const handleEdit = (price) => {
    setEditing(price)
    setForm({ crop_name: price.crop_name, market_name: price.market_name, price_per_kg: price.price_per_kg, recorded_date: price.recorded_date?.split('T')[0] })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this price record?')) {
      await axios.delete(`${API}/market-prices/${id}`)
      fetchPrices()
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1a3a05' }}>Market Prices</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ crop_name: '', market_name: '', price_per_kg: '', recorded_date: '' }) }}
          style={{ background: '#2d6010', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
        >
          + Add Price
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f7faf2', border: '1px solid #C0DD97', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#1a3a05' }}>{editing ? 'Edit Price' : 'Add Market Price'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input placeholder="Crop Name" value={form.crop_name} onChange={e => setForm({ ...form, crop_name: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input placeholder="Market Name" value={form.market_name} onChange={e => setForm({ ...form, market_name: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input placeholder="Price per KG (UGX)" value={form.price_per_kg} onChange={e => setForm({ ...form, price_per_kg: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input type="date" value={form.recorded_date} onChange={e => setForm({ ...form, recorded_date: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={handleSubmit}
              style={{ background: '#2d6010', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
              {editing ? 'Update' : 'Save'}
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ background: '#eee', color: '#333', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7faf2' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>#</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Crop</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Market</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Price per KG (UGX)</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Date Recorded</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prices.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
                  No market prices recorded yet. Click Add Price to get started.
                </td>
              </tr>
            ) : (
              prices.map((price, index) => (
                <tr key={price.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>{index + 1}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>{price.crop_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{price.market_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>UGX {Number(price.price_per_kg).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{price.recorded_date?.split('T')[0]}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleEdit(price)}
                      style={{ background: '#e8f4d8', color: '#2d6010', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(price.id)}
                      style={{ background: '#fee', color: '#c00', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MarketPrices 