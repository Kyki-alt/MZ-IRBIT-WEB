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

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`)
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      console.error(e)
    }
  }

  // CREATE
  const addProduct = async (product) => {
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })

      const data = await res.json()
      setProducts([data, ...products])
      setShowForm(false)

    } catch (e) {
      console.error(e)
    }
  }

  // UPDATE
  const updateProduct = async (id, product) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })

      const data = await res.json()

      setProducts(products.map(p =>
        p.id === id ? data : p
      ))

      setEditingProduct(null)
      setShowForm(false)

    } catch (e) {
      console.error(e)
    }
  }

  // DELETE
  const deleteProduct = async (id) => {
    try {
      await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE'
      })

      setProducts(products.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const startEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  return (
    <div>

      <div className="products-header">
        <h2>📦 Товары</h2>

        <button onClick={() => {
          setShowForm(!showForm)
          setEditingProduct(null)
        }}>
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

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
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
              <td>{p.price}</td>
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