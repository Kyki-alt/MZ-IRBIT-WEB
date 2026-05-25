import React, { useState } from 'react'

export default function ProductForm({ addProduct }) {

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [is_active, setIsActive] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()

    // ащита от отрицательной цены
    if (Number(price) < 0) {
      alert('Цена не может быть отрицательной')
      return
    }

    addProduct({
      title,
      price: Number(price),
      stock: Number(stock),
      description,
      is_active
    })

    setTitle('')
    setPrice('')
    setStock('')
    setDescription('')
    setIsActive(true)
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Название товара"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Цена"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        min="0"
      />

      <input
        type="number"
        placeholder="Количество"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        min="0"
      />

      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

        <input
          type="checkbox"
          checked={is_active}
          onChange={(e) => setIsActive(e.target.checked)}
        />

        В наличии

      </label>

      <button type="submit">
        Сохранить товар
      </button>

    </form>
  )
}