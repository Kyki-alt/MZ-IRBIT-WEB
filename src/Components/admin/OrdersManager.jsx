import React, { useEffect, useMemo, useState } from 'react'
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

  const [archiveMode, setArchiveMode] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://mz-irbit.onrender.com/orders')
      const data = await res.json()

      setOrders(Array.isArray(data) ? data : [])
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  // ================= FILTER =================

  const filteredOrders = useMemo(() => {

    let filtered = [...orders]

    const q = search.toLowerCase()

    // search
    if (q.trim()) {
      filtered = filtered.filter(order => {

        const dateText = order.created_at
          ? new Date(order.created_at).toLocaleString().toLowerCase()
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

    // archive filter
    if (archiveMode) {
      filtered = filtered.filter(o => o.is_archived === true)
    } else {
      filtered = filtered.filter(o => !o.is_archived)
    }

    // date filter
    if (dateFrom) {
      const from = new Date(dateFrom)
      filtered = filtered.filter(o =>
        new Date(o.created_at) >= from
      )
    }

    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)

      filtered = filtered.filter(o =>
        new Date(o.created_at) <= to
      )
    }

    // sort safe
    filtered.sort((a, b) => {

      const aValue = a[sortField] ?? ''
      const bValue = b[sortField] ?? ''

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      }

      return aValue < bValue ? 1 : -1
    })

    return filtered

  }, [orders, search, sortField, sortDirection, dateFrom, dateTo, archiveMode])

  // ================= STATUS =================

  const updateStatus = async (id, status) => {
    try {
      await fetch(`https://mz-irbit.onrender.com/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      setOrders(prev =>
        prev.map(o =>
          o.id === id
            ? { ...o, payment_status: status }
            : o
        )
      )
    } catch (e) {
      console.log(e)
    }
  }

  // ================= UI =================

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const applyQuickFilter = (type) => {

    const now = new Date()
    let from = null
    let to = new Date()

    switch (type) {

      case 'today':
        from = new Date()
        from.setHours(0,0,0,0)
        break

      case 'yesterday':
        from = new Date()
        from.setDate(now.getDate() - 1)
        from.setHours(0,0,0,0)

        to = new Date()
        to.setDate(now.getDate() - 1)
        to.setHours(23,59,59,999)
        break

      case '7days':
        from = new Date()
        from.setDate(now.getDate() - 7)
        break

      case '30days':
        from = new Date()
        from.setDate(now.getDate() - 30)
        break

      case 'month':
        from = new Date(now.getFullYear(), now.getMonth(), 1)
        break
    }

    setDateFrom(from ? from.toISOString().slice(0,10) : '')
    setDateTo(to ? to.toISOString().slice(0,10) : '')
  }

  if (loading) return <div className="orders-loading">Загрузка...</div>

  // ================= RENDER =================

  return (
    <div className="orders-page">

      {/* TOP BAR */}
      <div className="orders-topbar">

        <div className="left">
          <h2>🧾 Заказы</h2>
        </div>

        <div className="center">
          <input
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="right">

          <button onClick={() => setShowDateFilter(true)}>
            📅 Фильтр
          </button>

          <button onClick={() => setArchiveMode(p => !p)}>
            {archiveMode ? '📦 Активные' : '🗑 Архив'}
          </button>

        </div>

      </div>

      {/* TABLE */}
      <div className="orders-table-wrapper">

        <table className="orders-table">

          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID</th>
              <th onClick={() => handleSort('customer_name')}>Клиент</th>
              <th>Телефон</th>
              <th onClick={() => handleSort('total_price')}>Сумма</th>
              <th>Статус</th>
              <th onClick={() => handleSort('created_at')}>Дата</th>
            </tr>
          </thead>

          <tbody>

            {filteredOrders.map(order => (
              <React.Fragment key={order.id}>

                <tr
                  className="clickable"
                  onClick={() => toggleExpand(order.id)}
                >
                  <td>#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.phone}</td>

                  <td>
                    {Number(order.total_price).toLocaleString()} ₽
                  </td>

                  <td>
                    <select
                      value={order.payment_status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value)
                      }
                    >
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="failed">failed</option>
                    </select>
                  </td>

                  <td>
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                </tr>

                {expanded === order.id && (
                  <tr>
                    <td colSpan="6">

                      <div className="expanded-content">

                        <h4>📦 Товары</h4>

                        {order.items?.map(item => (
                          <div key={item.product_id}>
                            {item.title} — {item.quantity} × {item.price} ₽
                          </div>
                        ))}

                        <p>
                          {order.delivery_type === 'pickup'
                            ? '📦 Самовывоз'
                            : '🚚 Курьерская доставка'}
                        </p>

                      </div>

                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}

          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {showDateFilter && (
        <div className="modal-overlay" onClick={() => setShowDateFilter(false)}>

          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <h3>📅 Фильтр</h3>

            <div className="quick-filters">
              <button onClick={() => applyQuickFilter('today')}>Сегодня</button>
              <button onClick={() => applyQuickFilter('yesterday')}>Вчера</button>
              <button onClick={() => applyQuickFilter('7days')}>7 дней</button>
              <button onClick={() => applyQuickFilter('30days')}>30 дней</button>
              <button onClick={() => applyQuickFilter('month')}>Месяц</button>
            </div>

            <label>От</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />

            <label>До</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />

            <div className="modal-actions">

              <button onClick={() => { setDateFrom(''); setDateTo('') }}>
                Сброс
              </button>

              <button onClick={() => setShowDateFilter(false)}>
                Закрыть
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}