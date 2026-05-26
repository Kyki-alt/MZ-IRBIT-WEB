import { useEffect, useState } from 'react'

export default function OrdersManager() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://mz-irbit.onrender.com/orders')
      const data = await res.json()

      setOrders(data)
    } catch (err) {
      console.log('Ошибка загрузки заказов', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Загрузка заказов...</p>

  return (
    <div>
      <h2>🧾 Заказы</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Клиент</th>
            <th>Телефон</th>
            <th>Сумма</th>
            <th>Статус оплаты</th>
            <th>Дата</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{order.phone}</td>
              <td>{order.total_price} ₽</td>
              <td>{order.payment_status}</td>
              <td>{order.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}