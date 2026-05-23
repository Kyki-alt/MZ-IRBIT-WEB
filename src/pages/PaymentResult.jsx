import React, { useEffect } from 'react'

import {
  useSearchParams,
  useNavigate
} from 'react-router-dom'

export default function PaymentResult() {

  const [searchParams] =
    useSearchParams()

  const navigate =
    useNavigate()

  const status =
    searchParams.get('status')

  const orderId =
    searchParams.get('orderId')

  useEffect(() => {

    // если оплата успешна —
    // очищаем корзину
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
            Оплата прошла успешно ✅
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