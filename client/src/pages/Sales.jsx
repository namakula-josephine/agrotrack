import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api'

function Sales() {
  const [sales, setSales] = useState([])
  const [farmers, setFarmers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ farmer_id: '', crop_name: '', quantity_kg: '', price_per_kg: '', total_amount: '', buyer_name: '', sale_date: '' })

  useEffect(() => {
    fetchSales()
    fetchFarmers()
  }, [])

  const fetchSales = async () => {
    const res = await axios.get(`${API}/sales`)
    setSales(res.data)
  }

  const fetchFarmers = async () => {
    const res = await axios.get(`${API}/farmers`)
    setFarmers(res.data)
  }

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value }
    if (updated.quantity_kg && updated.price_per_kg) {
      updated.total_amount = (parseFloat(updated.quantity_kg) * parseFloat(updated.price_per_kg)).toFixed(2)
    }
    setForm(updated)
  }

  const handleSubmit = async () => {
    if (editing) {
      await axios.put(`${API}/sales/${editing.id}`, form)
    } else {
      await axios.post(`${API}/sales`, form)
    }
    setForm({ farmer_id: '', crop_name: '', quantity_kg: '', price_per_kg: '', total_amount: '', buyer_name: '', sale_date: '' })
    setEditing(null)
    setShowForm(false)
    fetchSales()
  }

  const handleEdit = (sale) => {
    setEditing(sale)
    setForm({ farmer_id: sale.farmer_id, crop_name: sale.crop_name, quantity_kg: sale.quantity_kg, price_per_kg: sale.price_per_kg, total_amount: sale.total_amount, buyer_name: sale.buyer_name, sale_date: sale.sale_date?.split('T')[0] })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this sale?')) {
      await axios.delete(`${API}/sales/${id}`)
      fetchSales()
    }
  }

  const totalRevenue = sales.reduce((sum, s) => sum + parseFloat(s.total_amount || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1a3a05' }}>Sales</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ farmer_id: '', crop_name: '', quantity_kg: '', price_per_kg: '', total_amount: '', buyer_name: '', sale_date: '' }) }}
          style={{ background: '#2d6010', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
        >
          + Add Sale
        </button>
      </div>

      <div style={{ background: '#f7faf2', border: '1px solid #C0DD97', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '14px', color: '#555' }}>Total Revenue:</span>
        <span style={{ fontSize: '22px', fontWeight: '700', color: '#2d6010' }}>UGX {totalRevenue.toLocaleString()}</span>
      </div>

      {showForm && (
        <div style={{ background: '#f7faf2', border: '1px solid #C0DD97', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#1a3a05' }}>{editing ? 'Edit Sale' : 'Add New Sale'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <select name="farmer_id" value={form.farmer_id} onChange={handleChange}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}>
              <option value="">Select Farmer</option>
              {farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <input name="crop_name" placeholder="Crop Name" value={form.crop_name} onChange={handleChange}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input name="quantity_kg" placeholder="Quantity (kg)" value={form.quantity_kg} onChange={handleChange}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input name="price_per_kg" placeholder="Price per KG (UGX)" value={form.price_per_kg} onChange={handleChange}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input name="total_amount" placeholder="Total Amount" value={form.total_amount} readOnly
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', background: '#eee' }} />
            <input name="buyer_name" placeholder="Buyer Name" value={form.buyer_name} onChange={handleChange}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input name="sale_date" type="date" value={form.sale_date} onChange={handleChange}
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
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Farmer</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Crop</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Qty (kg)</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Price/KG</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Total (UGX)</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Buyer</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
                  No sales recorded yet. Click Add Sale to get started.
                </td>
              </tr>
            ) : (
              sales.map((sale, index) => (
                <tr key={sale.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>{index + 1}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>{sale.farmer_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>{sale.crop_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{sale.quantity_kg}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>UGX {Number(sale.price_per_kg).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#2d6010' }}>UGX {Number(sale.total_amount).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{sale.buyer_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{sale.sale_date?.split('T')[0]}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleEdit(sale)}
                      style={{ background: '#e8f4d8', color: '#2d6010', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(sale.id)}
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

export default Sales