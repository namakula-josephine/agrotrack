import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api'

function Harvests() {
  const [harvests, setHarvests] = useState([])
  const [crops, setCrops] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ crop_id: '', harvest_date: '', quantity_kg: '', notes: '' })

  useEffect(() => {
    fetchHarvests()
    fetchCrops()
  }, [])

  const fetchHarvests = async () => {
    const res = await axios.get(`${API}/harvests`)
    setHarvests(res.data)
  }

  const fetchCrops = async () => {
    const res = await axios.get(`${API}/crops`)
    setCrops(res.data)
  }

  const handleSubmit = async () => {
    if (editing) {
      await axios.put(`${API}/harvests/${editing.id}`, form)
    } else {
      await axios.post(`${API}/harvests`, form)
    }
    setForm({ crop_id: '', harvest_date: '', quantity_kg: '', notes: '' })
    setEditing(null)
    setShowForm(false)
    fetchHarvests()
  }

  const handleEdit = (harvest) => {
    setEditing(harvest)
    setForm({ crop_id: harvest.crop_id, harvest_date: harvest.harvest_date?.split('T')[0], quantity_kg: harvest.quantity_kg, notes: harvest.notes })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this harvest?')) {
      await axios.delete(`${API}/harvests/${id}`)
      fetchHarvests()
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1a3a05' }}>Harvests</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ crop_id: '', harvest_date: '', quantity_kg: '', notes: '' }) }}
          style={{ background: '#2d6010', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
        >
          + Add Harvest
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f7faf2', border: '1px solid #C0DD97', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#1a3a05' }}>{editing ? 'Edit Harvest' : 'Add New Harvest'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <select value={form.crop_id} onChange={e => setForm({ ...form, crop_id: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}>
              <option value="">Select Crop</option>
              {crops.map(c => <option key={c.id} value={c.id}>{c.crop_name} - {c.farmer_name}</option>)}
            </select>
            <input type="date" value={form.harvest_date} onChange={e => setForm({ ...form, harvest_date: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input placeholder="Quantity (kg)" value={form.quantity_kg} onChange={e => setForm({ ...form, quantity_kg: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
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
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Harvest Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Quantity (kg)</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Notes</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {harvests.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
                  No harvests recorded yet. Click Add Harvest to get started.
                </td>
              </tr>
            ) : (
              harvests.map((harvest, index) => (
                <tr key={harvest.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>{index + 1}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>{harvest.crop_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{harvest.harvest_date?.split('T')[0]}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{harvest.quantity_kg} kg</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{harvest.notes}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleEdit(harvest)}
                      style={{ background: '#e8f4d8', color: '#2d6010', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(harvest.id)}
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

export default Harvests