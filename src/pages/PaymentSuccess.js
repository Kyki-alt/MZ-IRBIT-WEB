import React, {

  useEffect,
  useState

} from 'react'

import axios from 'axios'

import {

  useSearchParams,
  useNavigate

} from 'react-router-dom'

export default function PaymentSuccess() {

  const [status, setStatus] =
    useState('pending')

  const [searchParams] =
    useSearchParams()

  const navigate =
    useNavigate()

  const orderId =
    searchParams.get('orderId') ||
    searchParams.get('LMI_PAYMENT_NO')

  useEffect(() => {

    if (!orderId) return

    const interval = setInterval(
      async () => {

        try {

          const response =
            await axios.get(

              `https://mz-irbit.onrender.com/orders/${orderId}/status`
            )

          const paymentStatus =
            response.data.payment_status

          setStatus(paymentStatus)

          if (
            paymentStatus === 'paid'
          ) {

            localStorage.removeItem(
              'cart'
            )

            setTimeout(() => {

              navigate('/')

            }, 3000)

            clearInterval(interval)
          }

        } catch (error) {

          console.log(error)
        }

      },

      3000
    )

    return () =>
      clearInterval(interval)

  }, [orderId, navigate])

  return (

    <div
      style={{
        padding: '60px',
        textAlign: 'center'
      }}
    >

      <h1>
        Проверка оплаты...
      </h1>

      <h2>

        Заказ №{orderId}

      </h2>

      {status === 'pending' && (

        <p>
          Ожидаем подтверждение оплаты...
        </p>
      )}

      {status === 'paid' && (

        <div>

          <h2>
            Оплата успешно подтверждена ✅
          </h2>

          <p>
            Через 3 секунды
            вы вернетесь в магазин
          </p>

        </div>
      )}

    </div>
  )
}