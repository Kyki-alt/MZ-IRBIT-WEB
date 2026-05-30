import { useState, useEffect } from 'react'
import './Checkout.css'

import {
  YMaps,
  Map,
  Placemark
} from '@pbe/react-yandex-maps'

export default function Checkout() {
  const [delivery, setDelivery] = useState('pickup')
  const [payment, setPayment] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [house, setHouse] = useState('')
  const [flat, setFlat] = useState('')
  const [isPrivateHouse, setIsPrivateHouse] = useState(false)

  const [errors, setErrors] = useState({})
  const [paymentError, setPaymentError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    setCartItems(cart)
  }, [])

  const productsTotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  )

  const deliveryPrice = delivery === 'pickup' ? 0 : 200
  const totalPrice = productsTotal + deliveryPrice

  const getPaymentClass = (type) =>
    payment === type ? 'payment active-payment' : 'payment'

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = 'Введите ФИО'
    }

    const cleanPhone = phone.replace(/\D/g, '')

    if (!cleanPhone) {
      newErrors.phone = 'Введите телефон'
    } else if (
      !(
        cleanPhone.length === 11 &&
        (cleanPhone.startsWith('7') || cleanPhone.startsWith('8'))
      )
    ) {
      newErrors.phone = 'Неверный номер телефона'
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = 'Некорректный email'
    }

    if (delivery === 'delivery') {
      const cityClean = city.replace('г. ', '').trim()
      const streetClean = street.replace('ул. ', '').trim()
      const houseClean = house.trim()

      if (
        cityClean.length < 2 ||
        !/^[А-Яа-яЁё\s-]+$/.test(cityClean)
      ) {
        newErrors.city = 'Некорректный город'
      }

      if (
        streetClean.length < 3 ||
        !/^[А-Яа-яЁё0-9\s.-]+$/.test(streetClean)
      ) {
        newErrors.street = 'Некорректная улица'
      }

      if (!/^[0-9]{1,4}[а-яА-Яa-zA-Z]?$/.test(houseClean)) {
        newErrors.house = 'Некорректный дом'
      }

      if (/(.)\1{3,}/.test(cityClean + streetClean + houseClean)) {
        newErrors.city = 'Подозрительный адрес'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ---------------- ORDER ----------------
  const handleOrder = async () => {
    if (loading) return
    setLoading(true)

    if (!validate()) {
      setLoading(false)
      return
    }

    if (!payment) {
      setPaymentError('Выберите способ оплаты')
      setLoading(false)
      return
    }

    setPaymentError('')

    if (delivery === 'delivery' && (!city || !street || !house)) {
      setAddressError('Заполните адрес доставки')
      setLoading(false)
      return
    }

    setAddressError('')

    let validateData

    try {
      const res = await fetch(
        'https://mz-irbit.onrender.com/cart/validate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cartItems })
        }
      )

      validateData = await res.json()
    } catch (e) {
      setLoading(false)
      setAddressError('Ошибка проверки корзины')
      return
    }

    const updatedCart = cartItems.map(item => {
      const check = validateData.items?.find(i => i.id === item.id)

      if (!check) return item
      if (check.status === 'out_of_stock') {
        return { ...item, disabled: true, quantity: 0 }
      }
      if (check.status === 'partial') {
        return { ...item, quantity: check.available }
      }
      return item
    })

    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))

    const validItems = updatedCart.filter(
      item => !item.disabled && item.quantity > 0
    )

    if (!validItems.length) {
      setLoading(false)
      setAddressError('Нет товаров для покупки')
      return
    }

    const orderResponse = await fetch(
      'https://mz-irbit.onrender.com/orders',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          phone,
          email,
          delivery_type: delivery,
          payment_type: payment,
          city,
          street,
          house,
          flat,
          total_price: totalPrice,
          items: validItems
        })
      }
    )

    const orderData = await orderResponse.json()
    const orderId = orderData.orderId

    if (payment === 'cash') {
      localStorage.removeItem('cart')
      window.location.href = `/#/payment-result?status=cod&orderId=${orderId}`
      return
    }

    const rate = await fetch('https://open.er-api.com/v6/latest/RUB')
    const rateData = await rate.json()

    const usdAmount = (totalPrice * rateData.rates.USD).toFixed(2)

    if (payment === 'wm') {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://merchant.webmoney.ru/lmi/payment.asp'

      const fields = {
        LMI_PAYEE_PURSE: 'Z084048337634',
        LMI_PAYMENT_AMOUNT: usdAmount,
        LMI_PAYMENT_NO: orderId,
        LMI_RESULT_URL: 'https://mz-irbit.onrender.com/payment/webmoney/result',
        LMI_SUCCESS_URL: `https://mz-irbit.onrender.com/payment/success?orderId=${orderId}`,
        LMI_FAIL_URL: `https://mz-irbit.onrender.com/payment/fail?orderId=${orderId}`,
        LMI_PAYMENT_DESC_BASE64: btoa(
          unescape(encodeURIComponent('Оплата заказа'))
        )
      }

      Object.entries(fields).forEach(([k, v]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = k
        input.value = v
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    }
  }

  // ---------------- UI ----------------
  return (
    <div className="checkout">
      <div className="checkout-wrapper">

        <h1 className="title">Оформление заказа</h1>

        <button
          className="submit"
          onClick={handleOrder}
          disabled={loading}
        >
          {loading ? 'Оформляем заказ...' : 'Подтвердить заказ'}
        </button>

      </div>
    </div>
  )
}