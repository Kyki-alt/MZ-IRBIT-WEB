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

      newErrors.name =
        'Введите ФИО'

    } else {

      const fullName =
        name
          .trim()
          .replace(/\s+/g, ' ')

      // только русские буквы
      const fioRegex =
        /^[А-Яа-яЁё\s-]+$/

      if (!fioRegex.test(fullName)) {

        newErrors.name =
          'Допустимы только русские буквы'

      } else {

        const parts =
          fullName.split(' ')

        // минимум имя + фамилия
        if (parts.length < 2) {

          newErrors.name =
            'Введите имя и фамилию'

        } else {

          // проверка частей ФИО
          const invalidPart =
            parts.some(part => {

              // минимум 2 буквы
              if (part.length < 2) {
                return true
              }

              // странные наборы согласных
              if (
                /^[БВГДЖЗЙКЛМНПРСТФХЦЧШЩ]{2,}$/i.test(part)
              ) {
                return true
              }

              return false
            })

          if (invalidPart) {

            newErrors.name =
              'Введите корректное ФИО'
          }

          // подозрительные слова
          const suspiciousWords = [
            'Тест',
            'Admin',
            'User',
            'Qwerty',
            'Аааа',
            'Ыыыы'
          ]

          const hasSuspiciousWord =
            parts.some(part =>
              suspiciousWords.includes(part)
            )

          if (hasSuspiciousWord) {

            newErrors.name =
              'Введите корректное ФИО'
          }

          // повторяющиеся символы
          const weirdLetters =
            /(.)\1{3,}/

          if (
            weirdLetters.test(fullName)
          ) {

            newErrors.name =
              'Введите корректное ФИО'
          }
        }
      }

      // Телефон
      const cleanPhone =
        phone.replace(/\D/g, '')

      if (!cleanPhone) {

        newErrors.phone =
          'Введите телефон'

      } else {

        const isValidPhone =
          cleanPhone.length === 11 &&
          (
            cleanPhone.startsWith('7') ||
            cleanPhone.startsWith('8')
          )

        if (!isValidPhone) {
          newErrors.phone =
            'Неверный номер телефона'
        }
      }

      // Email
      if (email.trim() !== '') {

        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email)) {
          newErrors.email =
            'Некорректный email'
        }
      }

      // Проверка доставки
      if (delivery === 'delivery') {

        if (!city.trim()) {
          newErrors.city =
            'Введите город'
        }

        if (!street.trim()) {
          newErrors.street =
            'Введите улицу'
        }

        if (!house.trim()) {
          newErrors.house =
            'Введите дом'
        }
      }

      setErrors(newErrors)

      return Object.keys(newErrors).length === 0
    }
  }
  const handleOrder = async () => {
    if (loading) return
    setLoading(true)

    if (!validate()) {
      setLoading(false)
      return
    }

    // -------------------------
    // 1. проверка адреса
    // -------------------------
    if (delivery === 'delivery') {
      try {
        const normalizedCity =
          city.replace('г. ', '').trim()

        const normalizedStreet =
          street
            .replace('ул. ', '')
            .replace('пр. ', '')
            .replace('пер. ', '')
            .trim()

        const fullAddress =
          `${normalizedCity}, ${normalizedStreet}, ${house}`

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
        )

        const result = await response.json()

        if (!result.length) {
          setAddressError('Адрес не найден')
          setLoading(false)
          return
        }

        const foundAddress =
          result[0].display_name.toLowerCase()

        if (!foundAddress.includes(house.toLowerCase().trim())) {
          setAddressError('Дом не найден')
          setLoading(false)
          return
        }

        setAddressError('')
      } catch (error) {
        console.log(error)
        setLoading(false)
        setAddressError('Ошибка проверки адреса')
        return
      }
    }

    // -------------------------
    // 2. проверка оплаты
    // -------------------------
    if (!payment) {
      setPaymentError('Выберите способ оплаты')
      setLoading(false)
      return
    }

    setPaymentError('')

    // -------------------------
    // 3. проверка корзины
    // -------------------------
    let validateData

    try {
      const validateResponse = await fetch(
        'https://mz-irbit.onrender.com/cart/validate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: cartItems
          })
        }
      )

      validateData = await validateResponse.json()
    } catch (error) {
      console.log(error)
      setLoading(false)
      setAddressError('Ошибка проверки корзины')
      return
    }

    // -------------------------
    // 4. обновляем корзину
    // -------------------------
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

    if (validItems.length === 0) {
      setLoading(false)
      setAddressError('Нет товаров для покупки')
      return
    }

    // -------------------------
    // 5. создаём заказ
    // -------------------------
    const orderResponse = await fetch(
      'https://mz-irbit.onrender.com/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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

    // -------------------------
    // 6. оплата при получении
    // -------------------------
    if (payment === 'cash') {
      localStorage.removeItem('cart')

      window.location.href =
        `/#/payment-result?status=cod&orderId=${orderId}`

      return
    }

    // -------------------------
    // 7. WebMoney
    // -------------------------
    const rubAmount = totalPrice

    const rateResponse = await fetch(
      'https://open.er-api.com/v6/latest/RUB'
    )

    const rateData = await rateResponse.json()

    const usdRate = rateData.rates.USD
    const usdAmount = (rubAmount * usdRate).toFixed(2)

    if (payment === 'wm') {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action =
        'https://merchant.webmoney.ru/lmi/payment.asp'

      const fields = {
        LMI_PAYEE_PURSE: 'Z084048337634',
        LMI_PAYMENT_AMOUNT: usdAmount,
        LMI_PAYMENT_NO: orderId,
        LMI_RESULT_URL:
          'https://mz-irbit.onrender.com/payment/webmoney/result',
        LMI_SUCCESS_URL:
          `https://mz-irbit.onrender.com/payment/success?orderId=${orderId}`,
        LMI_FAIL_URL:
          `https://mz-irbit.onrender.com/payment/fail?orderId=${orderId}`,
        LMI_PAYMENT_DESC_BASE64: btoa(
          unescape(encodeURIComponent('Оплата заказа'))
        )
      }

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    }
  }

    return (
      <div className="checkout">
        <div className="checkout-wrapper">

          <h1 className="title">
            Оформление заказа
          </h1>

          {/* Получатель */}
          <section className="block">
            <h2>Получатель</h2>
            <br></br>

            <div className="inputs">
              <div>
                <input
                  type="text"
                  placeholder="ФИО получателя"
                  value={name}

                  onChange={(e) => {

                    let value =
                      e.target.value
                        // только русские буквы, пробелы и дефис
                        .replace(
                          /[^А-Яа-яЁё\s]/g,
                          ''
                        )

                        // убрать двойные пробелы
                        .replace(/\s+/g, ' ')

                    // заглавные буквы
                    value = value
                      .split(' ')
                      .map(word => {

                        return word.charAt(0)
                          .toUpperCase() +
                          word
                            .slice(1)
                            .toLowerCase()

                      })
                      .join(' ')

                    setName(value)
                  }}

                  onPaste={(e) => {

                    e.preventDefault()

                    const pasted =
                      e.clipboardData
                        .getData('text')

                    let clean =
                      pasted

                        // запрет английских букв,
                        // цифр и символов
                        .replace(
                          /[^А-Яа-яЁё\s-]/g,
                          ''
                        )

                        // убрать двойные пробелы
                        .replace(/\s+/g, ' ')

                    // заглавные буквы
                    clean = clean
                      .split(' ')
                      .map(word => {

                        return word.charAt(0)
                          .toUpperCase() +
                          word
                            .slice(1)
                            .toLowerCase()

                      })
                      .join(' ')

                    setName(clean)
                  }}
                />

                <small className="hint">
                  Например: Иванов Иван Иванович
                </small>

                {errors.name && (
                  <span className="error">
                    {errors.name}
                  </span>
                )}
              </div>

              <input
                type="text"
                placeholder="Телефон"
                value={phone}
                onChange={(e) => {
                let value = e.target.value

                // только цифры
                value = value.replace(/\D/g, '')

                // ограничим длину (11 цифр РФ)
                if (value.length > 11) {
                  value = value.slice(0, 11)
                }

                setPhone(value)
              }}
              />
              <input
                type="email"
                placeholder="E-mail (необязательно)"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              {errors.email && (
                <span className="error">
                  {errors.email}
                </span>
              )}
            </div>
          </section>

          {/* Получение */}
          <section className="block">
            <h2>Способ получения</h2>

            <div className="tabs">
              <button
                className={
                  delivery === 'pickup'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setDelivery('pickup')
                }
              >
                Самовывоз
              </button>

              <button
                className={
                  delivery === 'delivery'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setDelivery('delivery')
                }
              >
                Доставка
              </button>
            </div>

            {delivery === 'pickup' ? (
              <div className="pickup-card">

                <div className="pickup-info">
                  <h3>
                    Ирбитский молочный завод
                  </h3>
                  <br></br>
                  <p>
                    Ежедневно с 8:00 до 17:00
                  </p>
                  <br></br>
                  <p>
                    Ирбит, ул. Елизарьевых,
                    дом 3
                  </p>
                </div>

                <div className="map-wrapper">
                  <YMaps>
                    <Map
                      defaultState={{
                        center: [57.678233, 63.071533],
                        zoom: 16
                      }}
                      width="100%"
                      height="300px"
                    >
                      <Placemark
                        geometry={[57.678233, 63.071533]}
                        properties={{
                          balloonContent:
                            'Ирбитский молочный завод, ул. Елизарьевых, 3'
                        }}
                      />
                    </Map>
                  </YMaps>
                </div>

              </div>
            ) : (
              <div className="delivery-form">

                <input
                  type="text"
                  placeholder="г. Город"
                  value={city}
                  onChange={(e) => {

                    let value = e.target.value

                      // только русские буквы, пробелы и дефис
                      .replace(/[^А-Яа-яЁё\s]/g, '')

                      // убрать цифры
                      .replace(/[0-9]/g, '')

                      // убрать любые варианты "г"
                      .replace(/^(г\.?\s*)+/i, '')

                      .trimStart()

                    // Первая буква заглавная
                    value =
                      value.charAt(0).toUpperCase() +
                      value.slice(1).toLowerCase()

                    // Добавить префикс
                    if (value) {
                      value = `г. ${value}`
                    }

                    setCity(value)
                  }}
                />

                {errors.city && (
                  <span className="error">
                    {errors.city}
                  </span>
                )}

                <input
                  type="text"
                  placeholder="ул. Улица"
                  value={street}
                  onChange={(e) => {

                    let value = e.target.value

                      // только русские буквы, пробелы, точки и дефис
                      .replace(/[^А-Яа-яЁё\s.]/g, '')

                      // убрать старые префиксы
                      .replace(/^(ул\.|пр\.|пер\.)\s*/i, '')

                      .trimStart()

                    // Заглавная буква
                    value =
                      value.charAt(0).toUpperCase() +
                      value.slice(1).toLowerCase()

                    // автоподстановка
                    if (value) {
                      value = `ул. ${value}`
                    }

                    setStreet(value)
                  }}
                />

                {errors.street && (
                  <span className="error">
                    {errors.street}
                  </span>
                )}

                <div className="row">

                 <input
                  type="text"
                  placeholder="Дом"
                  value={house}
                  onChange={(e) => {

                    let value = e.target.value

                      // только цифры и русские буквы
                      .replace(/[^0-9А-Яа-яЁё\s]/g, '')

                      // убрать пробелы в начале
                      .trimStart()

                    setHouse(value)
                  }}
                />

                  {!isPrivateHouse && (
                    <input
                    type="text"
                    placeholder="Квартира"
                    value={flat}
                    onChange={(e) => {

                      let value = e.target.value

                        // только цифры
                        .replace(/[^0-9]/g, '')

                      setFlat(value)
                    }}
                  />
                  )}

                </div>

                {errors.house && (
                  <span className="error">
                    {errors.house}
                  </span>
                )}

                {addressError && (
                  <span className="error">
                    {addressError}
                  </span>
                )}

                <div className="private-house-row">

                  <label className="private-house-label">

                    <input
                      type="checkbox"
                      checked={isPrivateHouse}
                      onChange={(e) => {

                        setIsPrivateHouse(
                          e.target.checked
                        )

                        if (e.target.checked) {
                          setFlat('')
                        }
                      }}
                    />

                    <span>Частный дом</span>

                  </label>

                </div>

              </div>
            )}
          </section>

          {/* Оплата */}
          <section className="block">
            <h2>Способ оплаты</h2>

            <div className="payment-grid">

              <div
                className={getPaymentClass('wm')}
                onClick={() => {
                  setPayment('wm');
                  setPaymentError('');
                }}
                >
                <img
                  src="/img/card.png"
                  alt="Online payment"
                  className="payment-icon"
                />
                Оплата онлайн
            </div>

              <div
                className={
                  payment === 'cash'
                    ? 'payment active-payment'
                    : 'payment'
                }
                onClick={() => {
                  setPayment('cash')
                  setPaymentError('')
                }}
              >
                <img
                  src="/img/cash.png"
                  alt="Cash"
                  className="payment-icon"
                />
                Оплата при получении
              </div>

            </div>

          </section>

          {/* Итог */}
          <section className="summary">

          <div>
            <span>Товары</span>
            <b>{productsTotal.toFixed(2)} ₽</b>
          </div>

          <div>
            <span>Доставка</span>

            <b>
              {deliveryPrice === 0
                ? 'Бесплатно'
                : `${deliveryPrice} ₽`}
            </b>
          </div>

          <div className="total">
            <span>Итого</span>
            <b>{totalPrice.toFixed(2)} ₽</b>
          </div>

            {paymentError && (
              <div className="error">
                {paymentError}
              </div>
            )}
            <button
              className="submit"
              onClick={handleOrder}
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Оформляем заказ...' : 'Подтвердить заказ'}
            </button>
          </section>

        </div>
      </div>
    )
}
