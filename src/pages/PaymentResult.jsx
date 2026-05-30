import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PaymentResult.css'
import API_URL from '../config'

fetch(`${API_URL}/orders/${orderId}`)

export default function PaymentResult() {

  const navigate = useNavigate()

  const hash = window.location.hash
  const queryString = hash.split('?')[1]
  const params = new URLSearchParams(queryString)

  const status = params.get('status')
  const orderId = params.get('orderId')

  const [seconds, setSeconds] = useState(12)

  useEffect(() => {
    if (status === 'success' || status === 'cod') {
      setSeconds(12)
    }
  }, [status])

  useEffect(() => {

    if (status !== 'success' && status !== 'cod') return
    if (seconds <= 0) {
      localStorage.removeItem('cart')
      navigate('/')
      return
    }

    const timer = setTimeout(() => {
      setSeconds(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)

  }, [seconds, status, navigate])

  const [order, setOrder] = useState(null)

    useEffect(() => {

      if (!orderId) return

      fetch(`https://mz-irbit.onrender.com/orders/${orderId}`)
        .then(res => res.json())
        .then(data => setOrder(data))
        .catch(console.error)

    }, [orderId])

  return (
    <div className="payment-wrapper">

      <div className={`payment-card ${status}`}>

        <div className="icon">
          {status === 'success'
            ? '✅'
            : status === 'cod'
            ? '📦'
            : '❌'}
        </div>

        <h1>
          {status === 'success'
            ? 'Оплата прошла успешно'
            : status === 'cod'
             ? (
            <>
              Заказ оформлен

              <div className="badge cod">
                Оплата при получении
              </div>

              <p className="text">
                Спасибо за заказ!  
                Оплата производится при получении товара курьеру или в пункте выдачи.
              </p>

              <div className="cod-box">
                <h3>Как это работает</h3>
                <ul>
                  <li>Мы обрабатываем ваш заказ</li>
                  <li>Готовим товар к отправке</li>
                  <li>Связываемся при необходимости</li>
                  <li>Вы оплачиваете при получении</li>
                </ul>
              </div>
            </>
          )
          : 'Ошибка оплаты'}
        </h1>

        <p className="order">
          Заказ № {orderId}
        </p>

        {order && (
        <div className="receipt">

          <h3>Чек</h3>

          {order.items.map(item => (
            <div
              key={item.product_id}
              className="receipt-row"
            >
              <span>
                {item.title} × {item.quantity}
              </span>

              <span>
                {item.price * item.quantity} ₽
              </span>
            </div>
          ))}

          <div className="receipt-total">
            Итого: {order.total_price} ₽
          </div>


          <a
            href={`https://mz-irbit.onrender.com/receipts/${orderId}.pdf`}
            target="_blank"
            rel="noreferrer"
          >
            Скачать чек PDF
          </a>

        </div>
      )}

        <p className="text">
          {status === 'success'
            ? `Спасибо за покупку! Переход в магазин через ${seconds} сек.`
            : status === 'cod'
            ? `Ваш заказ оформлен! 
            Переход через ${seconds} сек.`
            : 'Платёж не был завершён. Попробуйте снова.'}
        </p>

        <button
          className="btn"
          onClick={() => navigate('/')}
        >
          Перейти сейчас
        </button>

      </div>

    </div>
  )
}