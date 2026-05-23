import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './PaymentResult.css'

export default function PaymentResult() {

  const navigate = useNavigate()

  const hash = window.location.hash
  const queryString = hash.split('?')[1]
  const params = new URLSearchParams(queryString)

  const status = params.get('status')
  const orderId = params.get('orderId')

  useEffect(() => {
    if (status === 'success') {
      localStorage.removeItem('cart')

      setTimeout(() => {
        navigate('/')
      }, 5000)
    }
  }, [status, navigate])

  return (
    <div className="payment-wrapper">

      <div className={`payment-card ${status}`}>

        <div className="icon">
          {status === 'success' ? '✅' : '❌'}
        </div>

        <h1>
          {status === 'success'
            ? 'Оплата прошла успешно'
            : 'Ошибка оплаты'}
        </h1>

        <p className="order">
          Заказ № {orderId}
        </p>

        <p className="text">
          {status === 'success'
            ? 'Спасибо за покупку! Скоро вы будете перенаправлены в магазин.'
            : 'Платёж не был завершён. Попробуйте снова.'}
        </p>

        <button
          className="btn"
          onClick={() => navigate('/')}
        >
          Вернуться в магазин
        </button>

      </div>

    </div>
  )
}