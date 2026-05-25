import React, { useState } from 'react'
import ProductForm from './ProductForm'

export default function ProductsManager() {

  const [products, setProducts] =
    useState([])

  const [showForm, setShowForm] =
    useState(false)

  const addProduct = (product) => {

    const newProduct = {
      id: Date.now(),
      ...product
    }

    setProducts([
      ...products,
      newProduct
    ])

    setShowForm(false)
  }

  const deleteProduct = (id) => {

    const filtered =
      products.filter(
        product => product.id !== id
      )

    setProducts(filtered)
  }

  return (

    <div>

      <div className="products-header">

        <h2>📦 Товары</h2>

        <button
          className="add-product-btn"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {showForm
            ? 'Закрыть'
            : 'Добавить товар'}
        </button>

      </div>

      {showForm && (
        <ProductForm
          addProduct={addProduct}
        />
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
              <td colSpan="6">
                Товаров пока нет
              </td>
            </tr>
          ) : (

            products.map(product => (

              <tr key={product.id}>

                <td>{product.id}</td>

                <td>{product.title}</td>

                <td>
                  {product.price} ₽
                </td>

                <td>
                  {product.stock}
                </td>

                <td>
                  {product.active
                    ? 'В наличии'
                    : 'Скрыт'}
                </td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteProduct(
                        product.id
                      )
                    }
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