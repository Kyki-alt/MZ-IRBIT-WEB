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
  const [statusFilter, setStatusFilter] = useState('all')

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

    // SEARCH
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

    // DATE FILTER
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

    // STATUS FILTER
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order =>
        order.payment_status === statusFilter
      )
    }

    // SORT
    filtered.sort((a, b) => {

      const aValue = a[sortField] ?? ''
      const bValue = b[sortField] ?? ''

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      }

      return aValue < bValue ? 1 : -1
    })

    return filtered
  }, [orders, search, sortField, sortDirection, dateFrom, dateTo])

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
        from.setHours(0, 0, 0, 0)
        break

      case 'yesterday':
        from = new Date()
        from.setDate(now.getDate() - 1)
        from.setHours(0, 0, 0, 0)

        to = new Date()
        to.setDate(now.getDate() - 1)
        to.setHours(23, 59, 59, 999)
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

    setDateFrom(from ? from.toISOString().slice(0, 10) : '')
    setDateTo(to ? to.toISOString().slice(0, 10) : '')
  }

  if (loading) return <div className="orders-loading">Загрузка...</div>

  // ================= RENDER =================

  return (
  <div className="orders-admin">

    {/* HEADER как NewsManager */}
    <div className="orders-header-admin">

      <h2>🧾 Заказы</h2>

      <input
        placeholder="Поиск заказов..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        >
        <option value="all">Все статусы</option>
        <option value="paid">Оплачен</option>
        <option value="pending">В процессе</option>
        <option value="failed">Отменен</option>
      </select>

      <button onClick={() => setShowDateFilter(true)}>
        📅 Фильтр
      </button>

    </div>

    {/* GRID вместо таблицы */}
    <div className="orders-grid">

      {filteredOrders.map(order => (
        <div key={order.id} className="order-card-admin">

          {/* TOP */}
          <div className="order-card-top" onClick={() => toggleExpand(order.id)}>

            <h3>Заказ #{order.id}</h3>

            <span className={`status ${order.payment_status}`}>
              {order.payment_status}
            </span>

          </div>

          {/* INFO */}
          <div className="order-info">

            <p>👤 {order.customer_name}</p>
            <p>📞 {order.phone}</p>
            <p>💰 {Number(order.total_price).toLocaleString()} ₽</p>
            <p>📅 {new Date(order.created_at).toLocaleString()}</p>

          </div>

          {/* STATUS */}
          <select
            value={order.payment_status}
            onChange={(e) => updateStatus(order.id, e.target.value)}
          >
            <option value="pending">в ожидании</option>
            <option value="paid">оплачен</option>
            <option value="failed">отменен</option>
          </select>

          {/* EXPANDED */}
          {expanded === order.id && (
            <div className="order-expanded">

              <h4>📦 Товары</h4>

              {order.items?.map(item => (
                <div key={item.product_id}>
                  {item.title} — {item.quantity} × {item.price} ₽
                </div>
              ))}

              <p>
                {order.delivery_type === 'pickup'
                  ? '📦 Самовывоз'
                  : '🚚 Доставка'}
              </p>

            </div>
          )}

        </div>
      ))}

    </div>

    {/* MODAL (оставляем как есть) */}
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