import React, { useState } from 'react'
import './AdminPanel.css'
import { useNavigate } from 'react-router-dom'
import ProductsManager from '../Components/admin/products/ProductsManager'
import OrdersManager from '../Components/admin/OrdersManager'

export default function AdminPanel() {

  const navigate = useNavigate()

  const [section, setSection] =
    useState('dashboard')

  const handleLogout = () => {

    localStorage.removeItem('adminToken')

    navigate('/admin/login')
  }

  const renderContent = () => {

    switch (section) {

      case 'products':
        return <ProductsManager />

      case 'orders':
        return <OrdersManager />

      case 'news':
        return (
          <div>
            <h2>📰 Новости</h2>
            <p>
              Управление новостями
            </p>
          </div>
        )

      case 'categories':
        return (
          <div>
            <h2>🗂 Категории</h2>
          </div>
        )

      case 'settings':
        return (
          <div>
            <h2>⚙️ Настройки</h2>
          </div>
        )

      default:
        return (
          <div>
            <h1>Добро пожаловать 👋</h1>

            <p>
              Выберите раздел слева
            </p>
          </div>
        )
    }
  }

  return (

    <div className="admin-layout">

      {/* SIDEBAR */}

      <div className="admin-sidebar">

        <h2 className="admin-logo">
          Admin Panel
        </h2>

        <button
          className={
            section === 'products'
              ? 'active'
              : ''
          }
          onClick={() =>
            setSection('products')
          }
        >
          📦 Товары
        </button>

        <button
          className={
            section === 'orders'
              ? 'active'
              : ''
          }
          onClick={() =>
            setSection('orders')
          }
        >
          🧾 Заказы
        </button>

        <button
          className={
            section === 'news'
              ? 'active'
              : ''
          }
          onClick={() =>
            setSection('news')
          }
        >
          📰 Новости
        </button>

        <button
          className={
            section === 'categories'
              ? 'active'
              : ''
          }
          onClick={() =>
            setSection('categories')
          }
        >
          🗂 Категории
        </button>

        <button
          className={
            section === 'settings'
              ? 'active'
              : ''
          }
          onClick={() =>
            setSection('settings')
          }
        >
          ⚙️ Настройки
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Выйти
        </button>

      </div>

      {/* CONTENT */}

      <div className="admin-content">

        {renderContent()}

      </div>

    </div>
  )
}