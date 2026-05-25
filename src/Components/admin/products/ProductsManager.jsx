import React, { useEffect, useState } from 'react'
import ProductForm from './ProductForm'
import API_URL from '../../../config'

export default function ProductsManager() {

  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async (query = '') => {
    const url = query
      ? `${API_URL}/api/products/search?q=${query}`
      : `${API_URL}/api/products`

    const res = await fetch(url)
    const data = await res.json()
    setProducts(data)
  }

  // CREATE
  const addProduct = async (product) => {
    const res = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })

    const data = await res.json()

    setProducts(prev => [data, ...prev])
    setShowForm(false)
  }

  // UPDATE (4. НЕ СОЗДАЁТ НОВУЮ СТРОКУ)
  const updateProduct = async (id, product) => {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })

    const data = await res.json()

    setProducts(prev =>
      prev.map(p => p.id === id ? data : p)
    )

    setEditingProduct(null)
    setShowForm(false)
  }

  const deleteProduct = async (id) => {
    await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE'
    })

    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const startEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  return (
    <div>

      <div className="products-header">
        <h2>📦 Товары</h2>

        <input
          placeholder="Поиск товаров..."
          onChange={(e) => fetchProducts(e.target.value)}
        />

        <button
          className="add-product-btn"
          onClick={() => {
            setShowForm(!showForm)
            setEditingProduct(null)
          }}
        >
          {showForm ? 'Закрыть' : 'Добавить'}
        </button>
      </div>

      {showForm && (
        <ProductForm
          addProduct={addProduct}
          updateProduct={updateProduct}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
        />
      )}

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Фото</th>
            <th>Цена</th>
            <th>Остаток</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>

              <td>
                {p.img
                  ? <img src={p.img} alt="" style={{ width: 50 }} />
                  : '—'
                }
              </td>

              <td>{p.price} ₽</td>
              <td>{p.stock}</td>
              <td>{p.is_active ? 'Активен' : 'Скрыт'}</td>

              <td>
                <button onClick={() => startEdit(p)}>
                  Редактировать
                </button>

                <button onClick={() => deleteProduct(p.id)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}