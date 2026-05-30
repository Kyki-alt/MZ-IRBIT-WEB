import { useState, useEffect } from 'react'
import './Checkout.css'
import axios from 'axios'

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
  const [validatedCart, setValidatedCart] = useState([])

  const getPaymentClass = (type) =>
  payment === type ? 'payment active-payment' : 'payment';
  

  useEffect(() => {

  const cart =
    JSON.parse(localStorage.getItem('cart')) || []

  setCartItems(cart)

  }, [])

  const productsTotal =
  cartItems.reduce(
    (sum, item) =>
      sum + (parseFloat(item.price) * item.quantity),
    0
  )

  const deliveryPrice =
    delivery === 'pickup'
      ? 0
      : 200

  const totalPrice =
    productsTotal + deliveryPrice
  
  
  const formatAddress = (
    value,
    type = 'street'
  ) => {

    let clean = value

      // только русские буквы, цифры, пробелы, точки и дефис
      .replace(
        /[^А-Яа-яЁё0-9\s.-]/g,
        ''
      )

      // убрать двойные пробелы
      .replace(/\s+/g, ' ')

    // ГОРОД
    if (type === 'city') {

      clean = clean

        // запрет цифр
        .replace(/[0-9]/g, '')

        // автоподстановка "г."
        .replace(
          /^([А-Яа-яЁё])/,
          'г. $1'
        )
    }

    // УЛИЦА
    if (type === 'street') {

      // если пользователь начал писать без "ул."
      if (
        clean.length > 2 &&
        !clean.match(
          /^(ул\.|проспект|пер\.|переулок)/i
        )
      ) {

        clean = `ул. ${clean}`
      }
    }

    // Заглавные буквы
    clean = clean.replace(
      /(^|\s|\.|-)\S/g,
      letter => letter.toUpperCase()
    )

    return clean
  }

  const validate = () => {
    let newErrors = {}

    // ФИО
    if (!name.trim()) {
      newErrors.name = 'Введите ФИО'
    }

    // телефон
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

    // email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Некорректный email'
    }

    // 🚚 ДОСТАВКА (БЕЗ ИНТЕРНЕТА)
    if (delivery === 'delivery') {
      const cityClean = city.replace('г. ', '').trim()
      const streetClean = street.replace('ул. ', '').trim()
      const houseClean = house.trim()

      // город
      if (cityClean.length < 2 || !/^[А-Яа-яЁё\s-]+$/.test(cityClean)) {
        newErrors.city = 'Некорректный город'
      }

      // улица
      if (streetClean.length < 3 || !/^[А-Яа-яЁё0-9\s.-]+$/.test(streetClean)) {
        newErrors.street = 'Некорректная улица'
      }

      // дом
      if (!/^[0-9]{1,4}[а-яА-Яa-zA-Z]?$/.test(houseClean)) {
        newErrors.house = 'Некорректный дом'
      }

      // 🚨 анти-абракадабра (простая логика)
      const weird = /(.)\1{3,}/
      if (weird.test(cityClean + streetClean + houseClean)) {
        newErrors.city = 'Подозрительный адрес'
      }
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }
}
