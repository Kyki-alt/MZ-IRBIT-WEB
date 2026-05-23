import React, { useEffect } from 'react'

import {
  useNavigate
} from 'react-router-dom'

export default function PaymentResult() {

  const navigate =
    useNavigate()

  // получаем hash
  const hash =
    window.location.hash

  // берём query после ?
  const queryString =
    hash.split('?')[1]

  // парсим параметры
  const params =
    new URLSearchParams(queryString)

  const status =
    params.get('status')

  const orderId =
    params.get('orderId')

  useEffect(() => {

    if (status === 'success') {

      localStorage.removeItem('cart')

      setTimeout(() => {

        navigate('/')

      }, 5000)
    }

  }, [status, navigate])

  return (

    <div className='payment-page'>

      {status === 'success' ? (

        <>

          <h1>
            Оплата успешна ✅
          </h1>

          <p>
            Заказ №{orderId}
          </p>

          <p>
            Через несколько секунд
            вы вернетесь в магазин
          </p>

        </>

      ) : (

        <>

          <h1>
            Ошибка оплаты ❌
          </h1>

          <p>
            Заказ №{orderId}
          </p>

          <p>
            Попробуйте снова
          </p>

        </>

      )}

    </div>
  )
}