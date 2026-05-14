
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Farmers from './pages/Farmers.jsx'
import Crops from './pages/Crops.jsx'
import Harvests from './pages/Harvests.jsx'
import MarketPrices from './pages/MarketPrices.jsx'
import Sales from './pages/Sales.jsx'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ marginLeft: '220px', padding: '24px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/harvests" element={<Harvests />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App