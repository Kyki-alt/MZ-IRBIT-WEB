import React, { useState } from 'react'

export default function ProductForm({
  addProduct
}) {

  const [title, setTitle] =
    useState('')

  const [price, setPrice] =
    useState('')

  const [stock, setStock] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [active, setActive] =
    useState(true)

  const handleSubmit = (e) => {

    e.preventDefault()

    addProduct({
      title,
      price,
      stock,
      description,
      active
    })

    setTitle('')
    setPrice('')
    setStock('')
    setDescription('')
    setActive(true)
  }

  return (

    <form
      className="product-form"
      onSubmit={handleSubmit}
    >

      <input
        type="text"
        placeholder="Название товара"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        required
      />

      <input
        type="number"
        placeholder="Цена"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
        required
      />

      <input
        type="number"
        placeholder="Количество"
        value={stock}
        onChange={(e) =>
          setStock(e.target.value)
        }
      />

      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <label>

        <input
          type="checkbox"
          checked={active}
          onChange={(e) =>
            setActive(e.target.checked)
          }
        />

        В наличии

      </label>

      <button type="submit">
        Сохранить товар
      </button>

    </form>
  )
}