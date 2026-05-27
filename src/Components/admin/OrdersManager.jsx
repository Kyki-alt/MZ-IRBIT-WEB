import { useEffect, useState } from 'react'
import './OrdersManager.css'

export default function OrdersManager() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {

    try {

      const res = await fetch(
        'https://mz-irbit.onrender.com/orders'
      )

      const data = await res.json()

      setOrders(
        Array.isArray(data) ? data : []
      )

    } catch (err) {

      console.log(
        'Ошибка загрузки заказов',
        err
      )

    } finally {

      setLoading(false)
    }
  }

  const getStatusClass = (status) => {

    switch (status) {

      case 'paid':
        return 'paid'

      case 'pending':
        return 'pending'

      case 'failed':
        return 'failed'

      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="orders-loading">
        Загрузка заказов...
      </div>
    )
  }

  return (

    <div className="orders-page">

      <div className="orders-header">

        <h2>
          🧾 Заказы
        </h2>

        <div className="orders-count">
          Всего: {orders.length}
        </div>

      </div>

      <div className="orders-table-wrapper">

        <table className="orders-table">

          <thead>

            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Сумма</th>
              <th>Оплата</th>
              <th>Доставка</th>
              <th>Дата</th>
            </tr>

          </thead>

          <tbody>

            {orders.length > 0 ? (

              orders.map(order => (

                <tr key={order.id}>

                  <td>
                    #{order.id}
                  </td>

                  <td>
                    {order.customer_name}
                  </td>

                  <td>
                    {order.phone}
                  </td>

                  <td>
                    {order.email || '-'}
                  </td>

                  <td className="price">
                    {Number(order.total_price)
                      .toLocaleString()} ₽
                  </td>

                  <td>

                    <span
                      className={`status ${getStatusClass(order.payment_status)}`}
                    >
                      {order.payment_status}
                    </span>

                  </td>

                  <td>
                    {order.delivery_type}
                  </td>

                  <td>
                    {new Date(order.created_at)
                      .toLocaleString()}
                  </td>

                </tr>
              ))

            ) : (

              <tr>

                <td colSpan="8">

                  <div className="empty-orders">

                    Заказов пока нет

                  </div>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}