import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Products() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = 'https://mz-irbit.onrender.com'

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const res = await axios.get(`${API_URL}/products`)

        setProducts(res.data)

      } catch (err) {

        console.log(err)

      } finally {

        setLoading(false)

      }

    }

    fetchProducts()

  }, [])

  if (loading) return <h2>Загрузка...</h2>

  return (
    <div>

      <h1>Товары</h1>

      <div className="products-grid">

        {products.map(item => (

          <div key={item.id}>

            <img
              src={`${API_URL}${item.img}`}
              alt={item.title}
            />

            <h3>{item.title}</h3>
            <p>{item.price} ₽</p>

          </div>

        ))}

      </div>

    </div>
  )
}