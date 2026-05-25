import React, { useEffect, useState } from 'react'
import ProductForm from './ProductForm'
import API_URL from '../../../config'

export default function ProductsManager() {

  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  // GET
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`)
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.error(err)
    }
  }

  // POST
  const addProduct = async (product) => {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      })

      const data = await response.json()

      setProducts([data, ...products])
      setShowForm(false)

    } catch (err) {
      console.error(err)
    }
  }

  // DELETE
  const deleteProduct = async (id) => {
    try {
      await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE'
      })

      setProducts(products.filter(p => p.id !== id))

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>

      <div className="products-header">
        <h2>📦 Товары</h2>

        <button
          className="add-product-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Закрыть' : 'Добавить товар'}
        </button>
      </div>

      {showForm && (
        <ProductForm addProduct={addProduct} />
      )}

      <table className="products-table">
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
          {products.length === 0 ? (
            <tr>
              <td colSpan="6">Товаров пока нет</td>
            </tr>
          ) : (
            products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.price} ₽</td>
                <td>{product.stock}</td>
                <td>
                  {product.active ? 'В наличии' : 'Скрыт'}
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  )
}