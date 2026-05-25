import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {
  HashRouter,
  Routes,
  Route
} from 'react-router-dom'

import App from './App'
import Checkout from './pages/Checkout'
import News from './pages/News'
import PaymentResult from './pages/PaymentResult'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import ProtectedRoute from './Сomponents/ProtectedRoute'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
<HashRouter>

  <Routes>

    /* Главная */
    <Route path="/" 
    element={<App />} 
    />

    /* Оформление заказа */
    <Route path="/checkout" 
    element={<Checkout />} 
    />

    <Route
      path="/news"
      element={<News />}
    />

    <Route
      path="/payment-result"
      element={<PaymentResult />}
      />

    <Route
      path="/admin/login"
      element={<AdminLogin />}
    />

    {/* Админка */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
        <AdminPanel />
        </ProtectedRoute>
      }
    />

  </Routes>

</HashRouter>
  </React.StrictMode>
)