import { useEffect, useMemo, useState } from 'react'
import './OrdersManager.css'

export default function OrdersManager() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState('desc')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showDateFilter, setShowDateFilter] = useState(false)

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
        Array.isArray(data)
          ? data
          : []
      )

    } catch (e) {

      console.log(e)

    } finally {

      setLoading(false)
    }
  }

  // =========================
  // SEARCH
  // =========================

  const filteredOrders = useMemo(() => {
  let filtered = [...orders]

  const q = search.toLowerCase()

  if (search.trim()) {
    filtered = filtered.filter(order => {
      const dateText = order.created_at
        ? new Date(order.created_at)
            .toLocaleString()
            .toLowerCase()
        : ''

      const delivery =
        order.delivery_type === 'pickup'
          ? 'самовывоз'
          : 'доставка'

      return (
        String(order.id).includes(q) ||
        order.customer_name?.toLowerCase().includes(q) ||
        order.phone?.toLowerCase().includes(q) ||
        dateText.includes(q) ||
        delivery.includes(q)
      )
    })
  }

    // =========================
    // 📅 FILTER BY DATE RANGE
    // =========================

    if (dateFrom) {
      const from = new Date(dateFrom)
      filtered = filtered.filter(order =>
        new Date(order.created_at) >= from
      )
    }

    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999) // включаем весь день

      filtered = filtered.filter(order =>
        new Date(order.created_at) <= to
      )
    }

    // =========================
    // SORT
    // =========================

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      }

      return aValue < bValue ? 1 : -1
    })

    return filtered
  }, [orders, search, sortField, sortDirection, dateFrom, dateTo])

  // =========================
  // STATUS UPDATE
  // =========================

  const updateStatus = async (
    id,
    status
  ) => {

    try {

      await fetch(
        `https://mz-irbit.onrender.com/orders/${id}/status`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            status
          })
        }
      )

      setOrders(prev =>
        prev.map(order =>
          order.id === id
            ? {
                ...order,
                payment_status: status
              }
            : order
        )
      )

    } catch (e) {

      console.log(e)
    }
  }

  const toggleExpand = (id) => {

    setExpanded(
      expanded === id
        ? null
        : id
    )
  }

  const handleSort = (field) => {

    if (sortField === field) {

      setSortDirection(prev =>
        prev === 'asc'
          ? 'desc'
          : 'asc'
      )

    } else {

      setSortField(field)

      setSortDirection('asc')
    }
  }

  if (loading) {

    return (
      <div className="orders-loading">
        Загрузка...
      </div>
    )
  }

  return (

    <div className="orders-page">

      <div className="orders-topbar">

        <div className="left">
          <h2>🧾 Заказы</h2>
        </div>

        <div className="center">
          <input
            type="text"
            placeholder="Поиск по заказам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="right">
          <button
            className="filter-btn"
            onClick={() => setShowDateFilter(true)}
          >
            📅 Фильтр
          </button>
        </div>

      </div>

      <div className="orders-table-wrapper">

        <table className="orders-table">

          <thead>

            <tr>

              <th onClick={() =>
                handleSort('id')
              }>
                ID
              </th>

              <th onClick={() =>
                handleSort(
                  'customer_name'
                )
              }>
                Клиент
              </th>

              <th>
                Телефон
              </th>

              <th onClick={() =>
                handleSort(
                  'total_price'
                )
              }>
                Сумма
              </th>

              <th>
                Статус
              </th>

              <th onClick={() =>
                handleSort(
                  'created_at'
                )
              }>
                Дата
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.map(order => (

              <>
                <tr
                  key={order.id}
                  onClick={() =>
                    toggleExpand(order.id)
                  }
                  className="clickable"
                >

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
                    {Number(
                      order.total_price
                    ).toLocaleString()} ₽
                  </td>

                  <td>

                    <select
                      value={
                        order.payment_status
                      }

                      onChange={e =>
                        updateStatus(
                          order.id,
                          e.target.value
                        )
                      }
                    >

                      <option value="pending">
                        pending
                      </option>

                      <option value="paid">
                        paid
                      </option>

                      <option value="failed">
                        failed
                      </option>

                    </select>

                  </td>

                  <td>

                    {new Date(
                      order.created_at
                    ).toLocaleString()}

                  </td>

                </tr>

                {expanded === order.id && (

                  <tr className="expanded-row">

                    <td colSpan="6">

                      <div className="expanded-content">

                        <h4>
                          📦 Товары
                        </h4>

                        <div className="items-list">

                          {order.items?.map(
                            item => (

                              <div
                                key={
                                  item.product_id
                                }
                              >

                                {item.title}
                                {' — '}
                                {item.quantity}
                                шт ×
                                {' '}
                                {item.price}
                                ₽

                              </div>
                            )
                          )}

                        </div>

                        <div className="delivery-info">

                          <p>
                            {
                              order.delivery_type === 'pickup'
                                ? '📦 Самовывоз'
                                : '🚚 Курьерская доставка'
                            }
                          </p>

                        </div>

                      </div>

                    </td>

                  </tr>
                )}

              </>
            ))}

          </tbody>

        </table>

      </div>

        {showDateFilter && (
        <div className="modal-overlay" onClick={() => setShowDateFilter(false)}>

          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <h3>📅 Фильтр по дате</h3>

            <label>От</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />

            <label>До</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />

            <div className="modal-actions">

              <button
                onClick={() => {
                  setDateFrom('')
                  setDateTo('')
                }}
              >
                Сбросить
              </button>

              <button
                onClick={() => setShowDateFilter(false)}
              >
                Применить
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}