import React, { useEffect, useState } from 'react'
import ProductForm from './ProductForm'
import API_URL from '../../../config'

export default function ProductsManager() {

  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showDeleted, setShowDeleted] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [showDeleted])


  const fetchProducts = async (query = '', deleted = showDeleted) => {
    let url = `${API_URL}/api/products`

    if (query) {
      url = `${API_URL}/api/products/search?q=${query}&deleted=${deleted}`
    } else {
      url = `${API_URL}/api/products?deleted=${deleted}`
    }

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
    showToast('Товар добавлен')
  }

  // UPDATE 
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
    showToast('Товар обновлён')
  }

  const deleteProduct = async (id) => {
    await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE'
    })

    setProducts(prev => prev.filter(p => p.id !== id))
    showToast('Товар удалён', 'error')
  }

  const startEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const restoreProduct = async (id) => {
    await fetch(`${API_URL}/api/products/${id}/restore`, {
      method: 'PATCH'
    })
    showToast('Товар восстановлен')
    fetchProducts('', showDeleted)
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })

    setTimeout(() => {
      setToast(null)
    }, 2500)
  }

  return (
    <div>

      <div className="products-header">
        <h2>📦 Товары</h2>

        <input
          placeholder="Поиск товаров..."
          onChange={(e) => fetchProducts(e.target.value, showDeleted)}
        />

        <button onClick={() => {
          setShowForm(!showForm)
          setEditingProduct(null)
        }}>
          {showForm ? 'Закрыть' : 'Добавить'}
        </button>

        <button onClick={() => setShowDeleted(prev => !prev)}>
          {showDeleted ? 'Активные' : 'Архив'}
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

      <div className="products-grid">
        {products.map(p => {

          const imgUrl = p.img
            ? p.img.startsWith('http')
              ? p.img
              : `${API_URL}${p.img}`
            : null

          return (
            <div className="product-card" key={p.id}>

              <div className="product-image">
                {imgUrl ? (
                  <img src={imgUrl} alt="" />
                ) : (
                  <div className="no-image">No image</div>
                )}
              </div>

              <div className="product-info">
                <h3>{p.title}</h3>

                <p className="price">{p.price} ₽</p>

                <p className="stock">
                  Остаток: {p.stock}
                </p>

                <p className={p.is_active ? 'status-active' : 'status-hidden'}>
                  {p.is_active ? 'Активен' : 'Скрыт'}
                </p>
              </div>

              <div className="product-actions">
                <button onClick={() => startEdit(p)}>Редактировать</button>

                <button onClick={() => deleteProduct(p.id)}>
                  Удалить
                </button>

                {showDeleted && (
                  <button onClick={() => restoreProduct(p.id)}>
                    Восстановить
                  </button>
                )}
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}