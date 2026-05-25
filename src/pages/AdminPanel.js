import React, { useState } from 'react'
import './AdminPanel.css'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel() {

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] =
    useState('')

  const handleLogout = () => {

    // удаляем JWT
    localStorage.removeItem(
      'adminToken'
    )

    // отправляем на логин
    navigate('/admin/login')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log({
      title,
      price,
      description
    })

    alert('Товар добавлен')
  }

  return (
    <div className="admin-page">

      <div className="admin-card">

        <div className="admin-header">

          <h1>Админ панель</h1>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Выйти
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Название товара"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Цена"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
          />

          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button type="submit">
            Добавить товар
          </button>

        </form>

      </div>

    </div>
  )
}