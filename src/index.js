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

  </Routes>

</HashRouter>
  </React.StrictMode>
)