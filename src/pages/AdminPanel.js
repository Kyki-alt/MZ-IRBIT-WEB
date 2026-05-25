import React, { useState } from 'react'
import './AdminPanel.css'

export default function AdminPanel() {

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')

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

        <h1>Админ панель</h1>

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