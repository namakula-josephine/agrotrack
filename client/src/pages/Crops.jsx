import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://agrotrack-api.onrender.com/api'

function Crops() {
  const [crops, setCrops] = useState([])
  const [farmers, setFarmers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ farmer_id: '', crop_name: '', planting_date: '', expected_harvest: '', status: 'growing' })

  useEffect(() => {
    fetchCrops()
    fetchFarmers()
  }, [])

  const fetchCrops = async () => {
    const res = await axios.get(`${API}/crops`)
    setCrops(res.data)
  }

  const fetchFarmers = async () => {
    const res = await axios.get(`${API}/farmers`)
    setFarmers(res.data)
  }

  const handleSubmit = async () => {
    if (editing) {
      await axios.put(`${API}/crops/${editing.id}`, form)
    } else {
      await axios.post(`${API}/crops`, form)
    }
    setForm({ farmer_id: '', crop_name: '', planting_date: '', expected_harvest: '', status: 'growing' })
    setEditing(null)
    setShowForm(false)
    fetchCrops()
  }

  const handleEdit = (crop) => {
    setEditing(crop)
    setForm({ farmer_id: crop.farmer_id, crop_name: crop.crop_name, planting_date: crop.planting_date?.split('T')[0], expected_harvest: crop.expected_harvest?.split('T')[0], status: crop.status })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this crop?')) {
      await axios.delete(`${API}/crops/${id}`)
      fetchCrops()
    }
  }

  const statusColor = (status) => {
    if (status === 'growing') return { background: '#e8f4d8', color: '#2d6010' }
    if (status === 'harvested') return { background: '#e8f0fe', color: '#1a56db' }
    if (status === 'failed') return { background: '#fee', color: '#c00' }
    return {}
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1a3a05' }}>Crops</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ farmer_id: '', crop_name: '', planting_date: '', expected_harvest: '', status: 'growing' }) }}
          style={{ background: '#2d6010', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
        >
          + Add Crop
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f7faf2', border: '1px solid #C0DD97', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#1a3a05' }}>{editing ? 'Edit Crop' : 'Add New Crop'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <select value={form.farmer_id} onChange={e => setForm({ ...form, farmer_id: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}>
              <option value="">Select Farmer</option>
              {farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <input placeholder="Crop Name" value={form.crop_name} onChange={e => setForm({ ...form, crop_name: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input type="date" placeholder="Planting Date" value={form.planting_date} onChange={e => setForm({ ...form, planting_date: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input type="date" placeholder="Expected Harvest" value={form.expected_harvest} onChange={e => setForm({ ...form, expected_harvest: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}>
              <option value="growing">Growing</option>
              <option value="harvested">Harvested</option>
              <option value="failed">Failed</option>
            </select>
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
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Planted</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Expected Harvest</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {crops.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
                  No crops added yet. Click Add Crop to get started.
                </td>
              </tr>
            ) : (
              crops.map((crop, index) => (
                <tr key={crop.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>{index + 1}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>{crop.farmer_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>{crop.crop_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{crop.planting_date?.split('T')[0]}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{crop.expected_harvest?.split('T')[0]}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ ...statusColor(crop.status), padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                      {crop.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleEdit(crop)}
                      style={{ background: '#e8f4d8', color: '#2d6010', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(crop.id)}
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

export default Crops