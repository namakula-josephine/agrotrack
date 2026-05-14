import { Link, useLocation } from 'react-router-dom'

const links = [
  { path: '/', label: 'Dashboard' },
  { path: '/farmers', label: 'Farmers' },
  { path: '/crops', label: 'Crops' },
  { path: '/harvests', label: 'Harvests' },
  { path: '/market-prices', label: 'Market Prices' },
  { path: '/sales', label: 'Sales' },
]

function Navbar() {
  const location = useLocation()

  return (
    <div style={{
      width: '220px',
      height: '100vh',
      background: '#1a3a05',
      position: 'fixed',
      top: 0,
      left: 0,
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }}>
      <div style={{ color: '#C0DD97', fontSize: '20px', fontWeight: '700', marginBottom: '24px', paddingLeft: '8px' }}>
        AgroTrack
      </div>
      {links.map(link => (
        <Link
          key={link.path}
          to={link.path}
          style={{
            color: location.pathname === link.path ? '#1a3a05' : '#EAF3DE',
            background: location.pathname === link.path ? '#C0DD97' : 'transparent',
            padding: '10px 12px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}

export default Navbar