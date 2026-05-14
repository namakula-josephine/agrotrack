import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://agrotrack-api.onrender.com/api'

function Farmers() {
  const [farmers, setFarmers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', location: '', land_size: '' })

  useEffect(() => {
    fetchFarmers()
  }, [])

  const fetchFarmers = async () => {
    const res = await axios.get(`${API}/farmers`)
    setFarmers(res.data)
  }

  const handleSubmit = async () => {
    if (editing) {
      await axios.put(`${API}/farmers/${editing.id}`, form)
    } else {
      await axios.post(`${API}/farmers`, form)
    }
    setForm({ name: '', phone: '', location: '', land_size: '' })
    setEditing(null)
    setShowForm(false)
    fetchFarmers()
  }

  const handleEdit = (farmer) => {
    setEditing(farmer)
    setForm({ name: farmer.name, phone: farmer.phone, location: farmer.location, land_size: farmer.land_size })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this farmer?')) {
      await axios.delete(`${API}/farmers/${id}`)
      fetchFarmers()
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1a3a05' }}>Farmers</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', phone: '', location: '', land_size: '' }) }}
          style={{ background: '#2d6010', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
        >
          + Add Farmer
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f7faf2', border: '1px solid #C0DD97', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#1a3a05' }}>{editing ? 'Edit Farmer' : 'Add New Farmer'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
            <input placeholder="Land Size (acres)" value={form.land_size} onChange={e => setForm({ ...form, land_size: e.target.value })}
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
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Phone</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Location</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Land (acres)</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#2d6010', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {farmers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
                  No farmers added yet. Click Add Farmer to get started.
                </td>
              </tr>
            ) : (
              farmers.map((farmer, index) => (
                <tr key={farmer.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>{index + 1}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>{farmer.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{farmer.phone}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{farmer.location}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>{farmer.land_size}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleEdit(farmer)}
                      style={{ background: '#e8f4d8', color: '#2d6010', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(farmer.id)}
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

export default Farmers 