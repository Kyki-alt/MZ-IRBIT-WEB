import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function OrdersManager() {

  const API_URL = 'https://mz-irbit.onrender.com'

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`)
      setOrders(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const changeStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/orders/${id}`, { status })
      fetchOrders()
    } catch (err) {
      console.log(err)
    }
  }

  // 🗄 архив вместо удаления
  const archiveOrder = async (id) => {
    try {
      await axios.put(`${API_URL}/orders/archive/${id}`)
      fetchOrders()
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) return <h2>Загрузка...</h2>

  return (
    <div style={{ padding: 20 }}>

      <h1>Заказы</h1>

      {orders.map(order => (

        <div
          key={order.id}
          style={{
            border: '1px solid #ccc',
            marginBottom: 10,
            padding: 10
          }}
        >

          <h3>Заказ #{order.id}</h3>

          <p>Имя: {order.customer_name}</p>
          <p>Телефон: {order.phone}</p>
          <p>Адрес: {order.address}</p>
          <p>Сумма: {order.total_price} ₽</p>
          <p>Статус: {order.status}</p>

          <select
            value={order.status}
            onChange={(e) =>
              changeStatus(order.id, e.target.value)
            }
          >
            <option value="new">Новый</option>
            <option value="processing">В работе</option>
            <option value="done">Готов</option>
            <option value="cancelled">Отменён</option>
          </select>

          <button
            onClick={() => archiveOrder(order.id)}
            style={{ marginLeft: 10 }}
          >
            В архив
          </button>

        </div>

      ))}

    </div>
  )
}