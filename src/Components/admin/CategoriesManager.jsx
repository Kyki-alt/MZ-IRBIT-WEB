import React, { useEffect, useState } from 'react'
import axios from 'axios'
import API_URL from '../../config'

export default function CategoriesManager() {

  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const res = await axios.get(
      `${API_URL}/api/categories`
    )

    setCategories(res.data)
  }

  const submit = async (e) => {
    e.preventDefault()

    const payload = {
      name
    }

    if (editingId) {

      await axios.put(
        `${API_URL}/api/categories/${editingId}`,
        payload
      )

    } else {

      await axios.post(
        `${API_URL}/api/categories`,
        payload
      )
    }

    reset()
    fetchCategories()
  }

  const edit = (item) => {
    setName(item.name)
    setEditingId(item.id)
  }

  const remove = async (id) => {
    await axios.delete(
      `${API_URL}/api/categories/${id}`
    )

    fetchCategories()
  }

  const reset = () => {
    setName('')
    setEditingId(null)
  }

  return (
    <div>

      <h2>🗂 Категории</h2>

      <form
        onSubmit={submit}
        className="product-form"
      >

        <input
          placeholder="Название категории"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">
          {editingId ? 'Обновить' : 'Создать'}
        </button>

      </form>

      <div className="products-grid">

        {categories.map(item => (

          <div
            key={item.id}
            className="product-card"
          >

            <h3>{item.name}</h3>

            <div className="product-actions">

              <button onClick={() => edit(item)}>
                Изменить
              </button>

              <button onClick={() => remove(item.id)}>
                Удалить
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}