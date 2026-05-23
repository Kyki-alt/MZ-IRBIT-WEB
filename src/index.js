import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import App from './App'
import Checkout from './pages/Checkout'
import News from './pages/News'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
<BrowserRouter>

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
      path="/payment-success"
      element={<PaymentSuccess />}
    />

    <Route
      path="/payment-failed"
      element={<PaymentFailed />}
    />

  </Routes>

</BrowserRouter>
  </React.StrictMode>
)